import { Token } from "./Token";
import { Tokenizer } from "./Tokenizer";
import { TokenType } from "../lib/enums";
import { PrePro } from "./PrePro";
import { Debug } from "../lib/debug";
import {
  Assignment,
  BinOp,
  Block,
  BoolVal,
  type GenericTreeNode,
  Identifier,
  If,
  IntVal,
  NoOp,
  Print,
  Scan,
  StringVal,
  UnOp,
  VarDec,
  While,
  StringField,
  SelectField,
  CheckboxField,
  FieldProperty,
  FormDec,
} from "./Node";
import { isTruthy } from "../lib/utils";
import { SymbolType } from "./SymbolTable";

type ReadOnlyItems = readonly (TokenType | (() => GenericTreeNode))[];

type StoreFor<Items extends ReadOnlyItems> = {
  [K in keyof Items]: Items[K] extends TokenType
    ? Token
    : Items[K] extends () => GenericTreeNode
    ? GenericTreeNode
    : never;
};

interface Sequence<Items extends ReadOnlyItems, R> {
  items: Items;
  onFinish: (itemsStore: StoreFor<Items>) => R;
  throwErrorOnFirstItem?: boolean;
  errorDetails?: { fn: string; details: string };
}

export class Parser {
  private static tokenizer: Tokenizer;

  static throwUnexpectedToken({
    fn,
    details,
    errorMessage = "Unexpected token.",
  }: {
    fn: string;
    details: string;
    errorMessage?: string;
  }): never {
    if (this.tokenizer.getNext().type === TokenType.EOF) {
      throw new Error("Premature EOF.");
    } else {
      Debug.log(`Current position: ${this.tokenizer.position}`);
      Debug.log(`Next token: ${this.tokenizer.getNext().getType()}`);
      Debug.log(`Raw source code:`);
      Debug.log(`---`);
      Debug.log(this.tokenizer.source);
      Debug.log(`---`);

      Debug.log(`Error thown from: ${fn}`);
      Debug.log(`Details: ${details}`);
      throw new Error(errorMessage);
    }
  }

  static readSequential<Items extends ReadOnlyItems, R>(
    sequence: Sequence<Items, R> & { throwErrorOnFirstItem: false }
  ): R | null;

  static readSequential<Items extends ReadOnlyItems, R>(
    sequence: Sequence<Items, R> & { throwErrorOnFirstItem?: true }
  ): R;

  static readSequential<Items extends ReadOnlyItems, R>({
    throwErrorOnFirstItem = true,
    ...sequence
  }: Sequence<Items, R>): R | null {
    const itemsStore: Array<Token | GenericTreeNode> = [];

    for (let i = 0; i < sequence.items.length; i++) {
      const item = sequence.items[i];

      if (typeof item === "string") {
        if (this.tokenizer.getNext().getType() === item) {
          itemsStore.push(this.tokenizer.getNext());
          this.tokenizer.selectNext();
          continue;
        } else if (i === 0 && !throwErrorOnFirstItem) {
          return null;
        } else {
          this.throwUnexpectedToken(
            sequence.errorDetails ?? {
              fn: "readSequential",
              details: "GENERIC",
            }
          );
        }
      } else if (typeof item === "function") {
        const node = item.call(this);
        itemsStore.push(node);
      } else {
        throw new Error("Invalid sequence.");
      }
    }

    return sequence.onFinish(itemsStore as StoreFor<Items>);
  }

  static parseStringArray(): (StringVal | Identifier)[] {
    if (this.tokenizer.getNext().getType() !== TokenType.OPEN_BRACKET) {
      this.throwUnexpectedToken({
        fn: "parseStringArray",
        details: "Expected '[' to start array",
      });
    }
    this.tokenizer.selectNext();

    const nodes: (StringVal | Identifier)[] = [];

    while (this.tokenizer.getNext().getType() !== TokenType.CLOSE_BRACKET) {
      const nextType = this.tokenizer.getNext().getType();
      
      if (nextType === TokenType.STRING) {
        nodes.push(new StringVal({
          value: this.tokenizer.getNext().getStringValue(),
        }));
        this.tokenizer.selectNext();
      } else if (nextType === TokenType.IDENTIFIER) {
        nodes.push(new Identifier({ token: this.tokenizer.getNext() }));
        this.tokenizer.selectNext();
      } else {
        this.throwUnexpectedToken({
          fn: "parseStringArray",
          details: "Expected string value or identifier in array",
        });
      }

      const nextTokenType = this.tokenizer.getNext().getType();
      if (nextTokenType === TokenType.COMMA) {
        this.tokenizer.selectNext();
      } else if (nextTokenType !== TokenType.CLOSE_BRACKET) {
        this.throwUnexpectedToken({
          fn: "parseStringArray",
          details: "Expected ',' or ']' after array element",
        });
      }
    }

    this.tokenizer.selectNext(); // Consume the closing bracket
    return nodes;
  }

  static parseFieldValue(): GenericTreeNode | (StringVal | Identifier)[] {
    const tokenType = this.tokenizer.getNext().getType();

    switch (tokenType) {
      case TokenType.STRING: {
        const node = new StringVal({
          value: this.tokenizer.getNext().getStringValue(),
        });
        this.tokenizer.selectNext();
        return node;
      }

      case TokenType.BOOL: {
        const node = new BoolVal({
          value: this.tokenizer.getNext().getBooleanValue(),
        });
        this.tokenizer.selectNext();
        return node;
      }

      case TokenType.INT: {
        const node = new IntVal({
          value: this.tokenizer.getNext().getNumericValue(),
          children: [],
        });
        this.tokenizer.selectNext();
        return node;
      }

      case TokenType.OPEN_BRACKET: {
        return this.parseStringArray();
      }

      default:
        this.throwUnexpectedToken({
          fn: "parseFieldValue",
          details: "Expected string, boolean, integer, or string array",
        });
    }
  }

  static parseFieldProperties(): Map<string, GenericTreeNode | (StringVal | Identifier)[]> {
    const properties = new Map<string, GenericTreeNode | (StringVal | Identifier)[]>();

    while (this.tokenizer.getNext().getType() !== TokenType.CLOSE_BRAC) {
      // Skip newlines for flexible formatting
      if (this.tokenizer.getNext().getType() === TokenType.NEW_LINE) {
        this.tokenizer.selectNext();
        continue;
      }

      if (this.tokenizer.getNext().getType() !== TokenType.IDENTIFIER) {
        this.throwUnexpectedToken({
          fn: "parseFieldProperties",
          details: "Expected property identifier",
        });
      }

      const key = this.tokenizer.getNext().getStringValue();
      this.tokenizer.selectNext();

      // Expect a colon after the key
      if (this.tokenizer.getNext().getType() !== TokenType.COLON) {
        this.throwUnexpectedToken({
          fn: "parseFieldProperties",
          details: "Expected ':' after property key",
        });
      }
      this.tokenizer.selectNext();

      // Parse the value
      const value = this.parseFieldValue();
      properties.set(key, value);

      // Handle optional comma or newline
      const nextType = this.tokenizer.getNext().getType();
      if (nextType === TokenType.COMMA) {
        this.tokenizer.selectNext();
      } else if (nextType !== TokenType.CLOSE_BRAC && nextType !== TokenType.NEW_LINE) {
        this.throwUnexpectedToken({
          fn: "parseFieldProperties",
          details: "Expected ',' or newline after property value",
        });
      }
    }

    return properties;
  }

  static parseFieldDeclaration(): GenericTreeNode {
    const fieldType = this.tokenizer.getNext().getType();
    let node: GenericTreeNode;

    // Verify and consume the field type token
    switch (fieldType) {
      case TokenType.STRING_FIELD:
      case TokenType.SELECT_FIELD:
      case TokenType.CHECKBOX_FIELD:
        this.tokenizer.selectNext();
        break;
      default:
        this.throwUnexpectedToken({
          fn: "parseFieldDeclaration",
          details: "Expected field type (string_field, select_field, or checkbox_field)",
        });
    }

    // Expect and consume the field name (identifier)
    if (this.tokenizer.getNext().getType() !== TokenType.IDENTIFIER) {
      this.throwUnexpectedToken({
        fn: "parseFieldDeclaration",
        details: "Expected field name identifier",
      });
    }
    const fieldName = this.tokenizer.getNext().getStringValue();
    this.tokenizer.selectNext();

    // Expect and consume opening brace
    if (this.tokenizer.getNext().getType() !== TokenType.OPEN_BRAC) {
      this.throwUnexpectedToken({
        fn: "parseFieldDeclaration",
        details: "Expected '{' to start field properties",
      });
    }
    this.tokenizer.selectNext();

    // Parse field properties
    const properties = this.parseFieldProperties();
    const propertyNodes: GenericTreeNode[] = [];

    // Convert properties map to FieldProperty nodes
    properties.forEach((value, key) => {
      if (Array.isArray(value)) {
        // For arrays of StringVal or Identifier nodes, use them directly
        propertyNodes.push(new FieldProperty({ value: key, children: value }));
      } else {
        // For other values (GenericTreeNode)
        propertyNodes.push(new FieldProperty({ value: key, children: [value] }));
      }
    });

    // Expect and consume closing brace
    if (this.tokenizer.getNext().getType() !== TokenType.CLOSE_BRAC) {
      this.throwUnexpectedToken({
        fn: "parseFieldDeclaration",
        details: "Expected '}' to end field properties",
      });
    }
    this.tokenizer.selectNext();

    // Create the appropriate field node based on type
    switch (fieldType) {
      case TokenType.STRING_FIELD:
        node = new StringField({ value: fieldName, children: propertyNodes });
        break;
      case TokenType.SELECT_FIELD:
        node = new SelectField({ value: fieldName, children: propertyNodes });
        break;
      case TokenType.CHECKBOX_FIELD:
        node = new CheckboxField({ value: fieldName, children: propertyNodes });
        break;
      default:
        throw new Error("Unreachable code");
    }

    return node;
  }

  static parseFormDeclaration(): FormDec {
    // Verify and consume the FORM token
    if (this.tokenizer.getNext().getType() !== TokenType.FORM) {
      this.throwUnexpectedToken({
        fn: "parseFormDeclaration",
        details: "Expected 'form' keyword",
      });
    }
    this.tokenizer.selectNext();

    // Expect and consume the form name (identifier)
    if (this.tokenizer.getNext().getType() !== TokenType.IDENTIFIER) {
      this.throwUnexpectedToken({
        fn: "parseFormDeclaration",
        details: "Expected form name identifier",
      });
    }
    const formName = this.tokenizer.getNext().getStringValue();
    this.tokenizer.selectNext();

    // Expect and consume opening brace
    if (this.tokenizer.getNext().getType() !== TokenType.OPEN_BRAC) {
      this.throwUnexpectedToken({
        fn: "parseFormDeclaration",
        details: "Expected '{' to start form body",
      });
    }
    this.tokenizer.selectNext();

    // Parse form fields
    const fields: GenericTreeNode[] = [];
    while (this.tokenizer.getNext().getType() !== TokenType.CLOSE_BRAC) {
      // Skip newlines for flexible formatting
      if (this.tokenizer.getNext().getType() === TokenType.NEW_LINE) {
        this.tokenizer.selectNext();
        continue;
      }

      // Handle if statements inside form
      if (this.tokenizer.getNext().getType() === TokenType.IF) {
        const [booleanExpression, ifBlock] = this.readSequential({
          items: [
            TokenType.IF,
            this.parseBooleanExpression,
            this.parseBlock,
          ] as const,
          onFinish: (itemsStore) => {
            const [_, booleanExpression, ifBlock] = itemsStore;
            return [booleanExpression, ifBlock];
          },
          errorDetails: { fn: "parseFormDeclaration", details: "IF" },
        });

        // Add the if statement as a field
        fields.push(new If({ children: [booleanExpression, ifBlock] }));

        // Skip optional newline after if statement block
        while (this.tokenizer.getNext().getType() === TokenType.NEW_LINE) {
          this.tokenizer.selectNext();
        }
        continue;
      }

      // Handle while loops inside form
      if (this.tokenizer.getNext().getType() === TokenType.WHILE) {
        const [booleanExpression, whileBlock] = this.readSequential({
          items: [
            TokenType.WHILE,
            this.parseBooleanExpression,
            this.parseBlock,
          ] as const,
          onFinish: (itemsStore) => {
            const [_, booleanExpression, whileBlock] = itemsStore;
            return [booleanExpression, whileBlock];
          },
          errorDetails: { fn: "parseFormDeclaration", details: "WHILE" },
        });

        // Add the while statement as a field
        fields.push(new While({ children: [booleanExpression, whileBlock] }));

        // Skip optional newline after while statement block
        while (this.tokenizer.getNext().getType() === TokenType.NEW_LINE) {
          this.tokenizer.selectNext();
        }
        continue;
      }

      // Parse each field declaration
      const field = this.parseFieldDeclaration();
      fields.push(field);

      // Skip optional newline after field
      while (this.tokenizer.getNext().getType() === TokenType.NEW_LINE) {
        this.tokenizer.selectNext();
      }
    }

    // Expect and consume closing brace
    if (this.tokenizer.getNext().getType() !== TokenType.CLOSE_BRAC) {
      this.throwUnexpectedToken({
        fn: "parseFormDeclaration",
        details: "Expected '}' to end form body",
      });
    }
    this.tokenizer.selectNext();

    // Create and return the form node
    return new FormDec({ value: formName, children: fields });
  }

  static parseFactor(): GenericTreeNode {
    if (this.tokenizer.getNext().getType() === TokenType.INT) {
      const node = new IntVal({
        value: this.tokenizer.getNext().getNumericValue(),
        children: [],
      });
      this.tokenizer.selectNext();
      return node;
    }

    if (this.tokenizer.getNext().getType() === TokenType.IDENTIFIER) {
      const node = new Identifier({ token: this.tokenizer.getNext() });
      this.tokenizer.selectNext();
      return node;
    }

    if (this.tokenizer.getNext().getType() === TokenType.STRING) {
      const node = new StringVal({
        value: this.tokenizer.getNext().getStringValue(),
      });
      this.tokenizer.selectNext();
      return node;
    }

    if (this.tokenizer.getNext().getType() === TokenType.BOOL) {
      const node = new BoolVal({
        value: this.tokenizer.getNext().getBooleanValue(),
      });
      this.tokenizer.selectNext();
      return node;
    }

    if (this.tokenizer.getNext().getType() === TokenType.PLUS) {
      this.tokenizer.selectNext();
      const node = new UnOp({
        value: TokenType.PLUS,
        children: [this.parseFactor()],
      });
      return node;
    }

    if (this.tokenizer.getNext().getType() === TokenType.MINUS) {
      this.tokenizer.selectNext();
      const node = new UnOp({
        value: TokenType.MINUS,
        children: [this.parseFactor()],
      });
      return node;
    }

    if (this.tokenizer.getNext().getType() === TokenType.NOT) {
      this.tokenizer.selectNext();
      const node = new UnOp({
        value: TokenType.NOT,
        children: [this.parseFactor()],
      });
      return node;
    }

    let node: GenericTreeNode | null;

    node = this.readSequential({
      items: [
        TokenType.OPEN_PAR,
        this.parseBooleanExpression,
        TokenType.CLOSE_PAR,
      ] as const,
      onFinish: (itemsStore) => {
        return itemsStore[1];
      },
      throwErrorOnFirstItem: false,
      errorDetails: {
        fn: "parseFactor",
        details: "OPEN_PAR",
      },
    });
    if (isTruthy(node)) return node;

    node = this.readSequential({
      items: [TokenType.READ, TokenType.OPEN_PAR, TokenType.CLOSE_PAR],
      onFinish: () => new Scan(),
      throwErrorOnFirstItem: false,
      errorDetails: {
        fn: "parseFactor",
        details: "READ",
      },
    });
    if (isTruthy(node)) return node;

    this.throwUnexpectedToken({
      fn: "parseFactor",
      details: "ESCAPE",
    });
  }

  static parseTerm(): GenericTreeNode {
    let node: GenericTreeNode = this.parseFactor();

    while (
      this.tokenizer.getNext().type === TokenType.X ||
      this.tokenizer.getNext().type === TokenType.DIVIDE
    ) {
      if (this.tokenizer.getNext().type === TokenType.X) {
        this.tokenizer.selectNext();
        node = new BinOp({
          value: TokenType.X,
          children: [node, this.parseFactor()],
        });
      } else {
        this.tokenizer.selectNext();
        node = new BinOp({
          value: TokenType.DIVIDE,
          children: [node, this.parseFactor()],
        });
      }
    }

    return node;
  }

  static parseExpression(): GenericTreeNode {
    let node: GenericTreeNode = this.parseTerm();

    while (
      this.tokenizer.getNext().type === TokenType.MINUS ||
      this.tokenizer.getNext().type === TokenType.PLUS
    ) {
      if (this.tokenizer.getNext().type === TokenType.PLUS) {
        this.tokenizer.selectNext();
        node = new BinOp({
          value: TokenType.PLUS,
          children: [node, this.parseTerm()],
        });
      } else {
        this.tokenizer.selectNext();
        node = new BinOp({
          value: TokenType.MINUS,
          children: [node, this.parseTerm()],
        });
      }
    }

    return node;
  }

  static parseRelationalExpression(): GenericTreeNode {
    let node: GenericTreeNode = this.parseExpression();

    while (
      this.tokenizer.getNext().type === TokenType.EQUALS ||
      this.tokenizer.getNext().type === TokenType.GREATER_THAN ||
      this.tokenizer.getNext().type === TokenType.LESS_THAN
    ) {
      if (this.tokenizer.getNext().type === TokenType.EQUALS) {
        this.tokenizer.selectNext();
        node = new BinOp({
          value: TokenType.EQUALS,
          children: [node, this.parseExpression()],
        });
      } else if (this.tokenizer.getNext().type === TokenType.GREATER_THAN) {
        this.tokenizer.selectNext();
        node = new BinOp({
          value: TokenType.GREATER_THAN,
          children: [node, this.parseExpression()],
        });
      } else {
        this.tokenizer.selectNext();
        node = new BinOp({
          value: TokenType.LESS_THAN,
          children: [node, this.parseExpression()],
        });
      }
    }

    return node;
  }

  static parseBooleanTerm(): GenericTreeNode {
    let node: GenericTreeNode = this.parseRelationalExpression();

    while (this.tokenizer.getNext().type === TokenType.AND) {
      this.tokenizer.selectNext();
      node = new BinOp({
        value: TokenType.AND,
        children: [node, this.parseRelationalExpression()],
      });
    }

    return node;
  }

  static parseBooleanExpression(): GenericTreeNode {
    let node: GenericTreeNode = this.parseBooleanTerm();

    while (this.tokenizer.getNext().type === TokenType.OR) {
      this.tokenizer.selectNext();
      node = new BinOp({
        value: TokenType.OR,
        children: [node, this.parseBooleanTerm()],
      });
    }

    return node;
  }

  static parseStatement(): GenericTreeNode {
    let node: GenericTreeNode | null;

    // Handle form declarations first
    if (this.tokenizer.getNext().getType() === TokenType.FORM) {
      const formNode = this.parseFormDeclaration();
      // Skip optional newline after form declaration
      if (this.tokenizer.getNext().getType() === TokenType.NEW_LINE) {
        this.tokenizer.selectNext();
      }
      return formNode;
    }

    // Handle Println statements
    node = this.readSequential({
      items: [
        TokenType.PRINTLN,
        TokenType.OPEN_PAR,
        this.parseBooleanExpression,
        TokenType.CLOSE_PAR,
        TokenType.NEW_LINE,
      ] as const,
      onFinish: (itemsStore) => {
        const booleanExpression = itemsStore[2];
        return new Print({ children: [booleanExpression] });
      },
      throwErrorOnFirstItem: false,
      errorDetails: { fn: "parseStatement", details: "PRINTLN" },
    });
    if (isTruthy(node)) return node;

    // Handle variable declarations
    if (this.tokenizer.getNext().getType() === TokenType.VAR) {
      const [identifier, typeToken] = this.readSequential({
        items: [TokenType.VAR, TokenType.IDENTIFIER, TokenType.TYPE] as const,
        onFinish: (itemsStore) => {
          const [_, identifierToken, typeToken] = itemsStore;
          return [new Identifier({ token: identifierToken }), typeToken];
        },
        errorDetails: { fn: "parseStatement", details: "VAR" },
      });

      const node = this.readSequential({
        items: [TokenType.ASSIGNMENT, this.parseBooleanExpression] as const,
        onFinish: (itemsStore) => {
          const expression = itemsStore[1];
          return new VarDec({
            value: typeToken.getStringValue() as SymbolType,
            children: [identifier, expression],
          });
        },
        throwErrorOnFirstItem: false,
        errorDetails: { fn: "parseStatement", details: "VAR/ASSIGNMENT" },
      });
      if (isTruthy(node)) return node;

      return this.readSequential({
        items: [TokenType.NEW_LINE],
        onFinish: () =>
          new VarDec({
            value: typeToken.getStringValue() as SymbolType,
            children: [identifier],
          }),
        errorDetails: { fn: "parseStatement", details: "IF/NEW_LINE" },
      });
    }

    // Handle assignments
    node = this.readSequential({
      items: [
        TokenType.IDENTIFIER,
        TokenType.ASSIGNMENT,
        this.parseBooleanExpression,
        TokenType.NEW_LINE,
      ] as const,
      onFinish: (itemsStore) => {
        const [identifierToken, _, expression] = itemsStore;
        const identifier = new Identifier({ token: identifierToken });
        return new Assignment({
          children: [identifier, expression],
        });
      },
      throwErrorOnFirstItem: false,
      errorDetails: { fn: "parseStatement", details: "IDENTIFIER" },
    });
    if (isTruthy(node)) return node;

    // Handle while loops
    node = this.readSequential({
      items: [
        TokenType.WHILE,
        this.parseBooleanExpression,
        this.parseBlock,
        TokenType.NEW_LINE,
      ] as const,
      onFinish: (itemsStore) => {
        const booleanExpression = itemsStore[1];
        const block = itemsStore[2];
        return new While({ children: [booleanExpression, block] });
      },
      throwErrorOnFirstItem: false,
      errorDetails: { fn: "parseStatement", details: "WHILE" },
    });
    if (isTruthy(node)) return node;

    // Handle if statements
    if (this.tokenizer.getNext().getType() === TokenType.IF) {
      const [booleanExpression, ifBlock] = this.readSequential({
        items: [
          TokenType.IF,
          this.parseBooleanExpression,
          this.parseBlock,
        ] as const,
        onFinish: (itemsStore) => {
          const [_, booleanExpression, ifBlock] = itemsStore;
          return [booleanExpression, ifBlock];
        },
        errorDetails: { fn: "parseStatement", details: "IF" },
      });

      const node = this.readSequential({
        items: [TokenType.ELSE, this.parseBlock, TokenType.NEW_LINE],
        onFinish: (itemsStore) => {
          const elseBlock = itemsStore[1];
          return new If({ children: [booleanExpression, ifBlock, elseBlock] });
        },
        throwErrorOnFirstItem: false,
        errorDetails: { fn: "parseStatement", details: "IF/ELSE" },
      });
      if (isTruthy(node)) return node;

      return this.readSequential({
        items: [TokenType.NEW_LINE],
        onFinish: () => new If({ children: [booleanExpression, ifBlock] }),
        errorDetails: { fn: "parseStatement", details: "IF/NEW_LINE" },
      });
    }

    // Handle empty lines
    if (this.tokenizer.getNext().getType() === TokenType.NEW_LINE) {
      this.tokenizer.selectNext();
      return new NoOp();
    }

    this.throwUnexpectedToken({
      fn: "parseStatement",
      details: "ESCAPE",
    });
  }

  static parseBlock(): GenericTreeNode {
    if (this.tokenizer.getNext().getType() === TokenType.OPEN_BRAC) {
      this.tokenizer.selectNext();
      if (this.tokenizer.getNext().getType() === TokenType.NEW_LINE) {
        this.tokenizer.selectNext();
        const statements: GenericTreeNode[] = [];
        while (this.tokenizer.getNext().getType() !== TokenType.CLOSE_BRAC) {
          // Skip newlines for flexible formatting
          if (this.tokenizer.getNext().getType() === TokenType.NEW_LINE) {
            this.tokenizer.selectNext();
            continue;
          }

          // Check if we're inside a form (by checking for field types)
          const nextType = this.tokenizer.getNext().getType();
          if (nextType === TokenType.STRING_FIELD || 
              nextType === TokenType.SELECT_FIELD || 
              nextType === TokenType.CHECKBOX_FIELD) {
            statements.push(this.parseFieldDeclaration());
          } else {
            statements.push(this.parseStatement());
          }
        }
        this.tokenizer.selectNext();
        return new Block({ children: statements });
      } else
        this.throwUnexpectedToken({
          fn: "parseBlock",
          details: "NEW_LINE",
        });
    } else {
      this.throwUnexpectedToken({
        fn: "parseBlock",
        details: "ESCAPE",
      });
    }
  }

  static run(sourceCode: string): GenericTreeNode {
    this.tokenizer = new Tokenizer({
      source: PrePro.filter(sourceCode),
      position: 0,
    });

    // Parse the initial block
    const result = this.parseBlock();

    // Verify we reached the end of the file
    if (this.tokenizer.getNext().getType() !== TokenType.EOF) {
      throw new Error("Could not detect EOF.");
    }

    return result;
  }
}
