import { TokenType } from "../lib/enums";
import { isTruthy } from "../lib/utils";
import {
  BYTE_SHIFT_INCREMENT,
  type InitializedSymbol,
  SymbolTable,
  SymbolType,
} from "./SymbolTable";
import { Token } from "./Token";
import { nodeIdService } from "./NodeIdService";
import { code as codeInstance } from "./Code";
import { formStore } from "./FormStore";

type LogicalOperator =
  | TokenType.OR
  | TokenType.AND
  | TokenType.EQUALS
  | TokenType.GREATER_THAN
  | TokenType.LESS_THAN;

type Operator =
  | TokenType.PLUS
  | TokenType.MINUS
  | TokenType.X
  | TokenType.DIVIDE;

type Variant = number | string | boolean | Operator | null;

type FormField = {
  type: "string_field" | "select_field" | "checkbox_field";
  name: string;
  properties: {
    label: string;
    required: boolean;
    placeholder: string;
    options?: string[];
  };
};

export interface TreeNode<V> {
  id: number;
  value: V;
  children: TreeNode<Variant>[];
  evaluate: (symbolTable: SymbolTable) => InitializedSymbol;
  generate: (symbolTable: SymbolTable) => void;
}

export type GenericTreeNode = TreeNode<Variant>;

export class BinOp implements TreeNode<Operator | LogicalOperator> {
  id: number;
  value: Operator | LogicalOperator;
  children: GenericTreeNode[];

  constructor({
    value,
    children,
  }: {
    value: Operator | LogicalOperator;
    children: GenericTreeNode[];
  }) {
    this.id = nodeIdService.getId();
    nodeIdService.increment();
    this.value = value;
    this.children = children;
  }

  handleStringOp(
    a: string,
    b: string,
    options: {
      allowComparison: boolean;
      errorMessage?: string;
    } = {
      allowComparison: true,
      errorMessage: `Invalid operation ${this.value} for operands of type string`,
    }
  ) {
    if (this.value === TokenType.PLUS) {
      return {
        type: SymbolType.STRING,
        value: a + b,
      };
    }

    if (!options.allowComparison) {
      throw new Error(options.errorMessage);
    }

    if (this.value === TokenType.LESS_THAN) {
      return {
        type: SymbolType.BOOL,
        value: a < b,
      };
    }

    if (this.value === TokenType.GREATER_THAN) {
      return {
        type: SymbolType.BOOL,
        value: a > b,
      };
    }

    if (this.value === TokenType.EQUALS) {
      return {
        type: SymbolType.BOOL,
        value: a === b,
      };
    }

    throw new Error(options.errorMessage);
  }

  evaluate(symbolTable: SymbolTable) {
    const [firstValue, secondValue] = this.children.map(
      (child) => child.evaluate(symbolTable).value
    );

    if (typeof firstValue === "string" && typeof secondValue === "string") {
      return this.handleStringOp(firstValue, secondValue);
    }

    if (typeof firstValue === "boolean" && typeof secondValue === "string") {
      return this.handleStringOp(String(firstValue), secondValue, {
        allowComparison: false,
        errorMessage: `Invalid operation ${this.value} for operands of type boolean and string`,
      });
    }

    if (typeof firstValue === "string" && typeof secondValue === "boolean") {
      return this.handleStringOp(firstValue, String(secondValue), {
        allowComparison: false,
        errorMessage: `Invalid operation ${this.value} for operands of type boolean and string`,
      });
    }

    if (typeof firstValue === "number" && typeof secondValue === "string") {
      return this.handleStringOp(String(firstValue), secondValue, {
        allowComparison: false,
        errorMessage: `Invalid operation ${this.value} for operands of type number and string`,
      });
    }

    if (typeof firstValue === "string" && typeof secondValue === "number") {
      return this.handleStringOp(firstValue, String(secondValue), {
        allowComparison: false,
        errorMessage: `Invalid operation ${this.value} for operands of type number and string`,
      });
    }

    if (typeof firstValue === "number" && typeof secondValue === "number") {
      switch (this.value) {
        case TokenType.PLUS:
          return {
            type: SymbolType.INT,
            value: firstValue + secondValue,
          };

        case TokenType.MINUS:
          return {
            type: SymbolType.INT,
            value: firstValue - secondValue,
          };

        case TokenType.DIVIDE:
          return {
            type: SymbolType.INT,
            value: Math.floor(firstValue / secondValue),
          };

        case TokenType.X:
          return {
            type: SymbolType.INT,
            value: firstValue * secondValue,
          };

        case TokenType.OR:
          return {
            type: SymbolType.BOOL,
            value: firstValue || secondValue ? true : false,
          };

        case TokenType.AND:
          return {
            type: SymbolType.BOOL,
            value: firstValue && secondValue ? true : false,
          };

        case TokenType.EQUALS:
          return {
            type: SymbolType.BOOL,
            value: firstValue == secondValue ? true : false,
          };

        case TokenType.GREATER_THAN:
          return {
            type: SymbolType.BOOL,
            value: firstValue > secondValue ? true : false,
          };

        case TokenType.LESS_THAN:
          return {
            type: SymbolType.BOOL,
            value: firstValue < secondValue ? true : false,
          };

        default:
          break;
      }
    }

    if (typeof firstValue === "boolean" && typeof secondValue === "boolean") {
      switch (this.value) {
        case TokenType.OR:
          return {
            type: SymbolType.BOOL,
            value: firstValue || secondValue ? true : false,
          };

        case TokenType.AND:
          return {
            type: SymbolType.BOOL,
            value: firstValue && secondValue ? true : false,
          };

        case TokenType.EQUALS:
          return {
            type: SymbolType.BOOL,
            value: firstValue == secondValue ? true : false,
          };

        case TokenType.GREATER_THAN:
          return {
            type: SymbolType.BOOL,
            value: firstValue > secondValue ? true : false,
          };

        case TokenType.LESS_THAN:
          return {
            type: SymbolType.BOOL,
            value: firstValue < secondValue ? true : false,
          };

        default:
          break;
      }
    }

    if (
      (typeof firstValue === "number" && typeof secondValue === "boolean") ||
      (typeof firstValue === "boolean" && typeof secondValue === "number")
    ) {
      throw new Error(
        `Invalid operation ${this.value} for operands of type number and boolean`
      );
    }

    return {
      type: SymbolType.INT,
      value: 0,
    };
  }

  generate(symbolTable: SymbolTable) {
    const [firstChild, secondChild] = this.children;

    if (
      this.value === TokenType.PLUS ||
      this.value === TokenType.MINUS ||
      this.value === TokenType.DIVIDE ||
      this.value === TokenType.X
    ) {
      secondChild.generate(symbolTable);
      codeInstance.append(`push eax ;`);

      firstChild.generate(symbolTable);
      codeInstance.append(`pop ecx ;`);

      switch (this.value) {
        case TokenType.PLUS:
          codeInstance.append(`add eax, ecx ;`);
          return;

        case TokenType.MINUS:
          codeInstance.append(`sub eax, ecx ;`);
          return;

        case TokenType.DIVIDE:
          codeInstance.append(`cdq           ;`);
          codeInstance.append(`idiv  ecx     ;`);
          return;

        case TokenType.X:
          codeInstance.append(`imul  ecx     ;`);
          return;
      }
    } else {
      secondChild.generate(symbolTable);
      codeInstance.append(`push eax ;`);

      firstChild.generate(symbolTable);
      codeInstance.append(`pop ecx ;`);

      switch (this.value) {
        case TokenType.EQUALS:
          codeInstance.append(`cmp eax, ecx ;`);
          codeInstance.append(`mov ecx, 1   ;`);
          codeInstance.append(`mov eax, 0   ;`);
          codeInstance.append(`cmove eax, ecx ;`);
          return;

        case TokenType.GREATER_THAN:
          codeInstance.append(`cmp eax, ecx ;`);
          codeInstance.append(`mov ecx, 1   ;`);
          codeInstance.append(`mov eax, 0   ;`);
          codeInstance.append(`cmovg eax, ecx ;`);
          return;

        case TokenType.LESS_THAN:
          codeInstance.append(`cmp eax, ecx ;`);
          codeInstance.append(`mov ecx, 1   ;`);
          codeInstance.append(`mov eax, 0   ;`);
          codeInstance.append(`cmovl eax, ecx ;`);
          return;

        case TokenType.OR:
          codeInstance.append(`or eax, ecx ;`);
          return;

        case TokenType.AND:
          codeInstance.append(`and eax, ecx ;`);
          return;
      }
    }
  }
}

export class UnOp
  implements TreeNode<TokenType.PLUS | TokenType.MINUS | TokenType.NOT>
{
  id: number;
  value: TokenType.PLUS | TokenType.MINUS | TokenType.NOT;
  children: GenericTreeNode[];

  constructor({
    value,
    children,
  }: {
    value: TokenType.PLUS | TokenType.MINUS | TokenType.NOT;
    children: GenericTreeNode[];
  }) {
    this.id = nodeIdService.getId();
    nodeIdService.increment();
    this.value = value;
    this.children = children;
  }

  evaluate(symbolTable: SymbolTable) {
    const child = this.children[0];

    if (this.value === TokenType.MINUS) {
      const childEval = child.evaluate(symbolTable);
      return {
        ...childEval,
        value: -childEval.value,
      };
    } else if (this.value === TokenType.PLUS) {
      return child.evaluate(symbolTable);
    } else {
      const symbol = child.evaluate(symbolTable);

      if (symbol.type === SymbolType.INT) {
        throw new Error(
          `Invalid operation ${this.value} for operand of type number`
        );
      }

      return !symbol.value
        ? {
            type: SymbolType.BOOL,
            value: true,
          }
        : {
            type: SymbolType.BOOL,
            value: false,
          };
    }
  }

  generate(symbolTable: SymbolTable) {
    const child = this.children[0];

    if (this.value === TokenType.MINUS) {
      child.generate(symbolTable);
      codeInstance.append(`neg eax;`);
    } else if (this.value === TokenType.PLUS) {
      child.generate(symbolTable);
    } else {
      child.generate(symbolTable);
      codeInstance.append(`test eax, eax;`);
      codeInstance.append(`setz al;`);
      codeInstance.append(`movzx eax, al;`);
    }
  }
}

export class IntVal implements TreeNode<number> {
  id: number;
  value: number;
  children: TreeNode<never>[];

  constructor({
    value,
    children,
  }: {
    value: number;
    children: TreeNode<never>[];
  }) {
    this.id = nodeIdService.getId();
    nodeIdService.increment();
    this.value = value;
    this.children = children;
  }

  evaluate() {
    return {
      type: SymbolType.INT,
      value: this.value,
    };
  }

  generate() {
    codeInstance.append(`mov eax, ${this.value} ;`);
  }
}

export class StringVal implements TreeNode<string> {
  id: number;
  value: string;
  children: TreeNode<never>[];

  constructor({ value }: { value: string }) {
    this.id = nodeIdService.getId();
    nodeIdService.increment();
    this.value = value;
    this.children = [];
  }

  evaluate() {
    return {
      type: SymbolType.STRING,
      value: this.value,
    };
  }

  generate() {}
}

export class BoolVal implements TreeNode<boolean> {
  id: number;
  value: boolean;
  children: TreeNode<never>[];

  constructor({ value }: { value: boolean }) {
    this.id = nodeIdService.getId();
    nodeIdService.increment();
    this.value = value;
    this.children = [];
  }

  evaluate() {
    return {
      type: SymbolType.BOOL,
      value: this.value,
    };
  }

  generate() {
    codeInstance.append(`mov eax, ${this.value ? "1" : "0"} ;`);
  }
}

export class NoOp implements TreeNode<null> {
  id: number;
  value: null;
  children: TreeNode<never>[];

  constructor() {
    this.id = nodeIdService.getId();
    nodeIdService.increment();
    this.value = null;
    this.children = [];
  }

  evaluate() {
    return {
      type: SymbolType.INT,
      value: this.value ?? 0,
    };
  }

  generate() {}
}

export class Identifier implements TreeNode<string> {
  id: number;
  value: string;
  children: TreeNode<never>[];

  constructor({ token }: { token: Token }) {
    if (token.getType() !== TokenType.IDENTIFIER) {
      throw new Error("Expected identifier token.");
    }

    this.id = nodeIdService.getId();
    nodeIdService.increment();
    this.value = token.getStringValue();
    this.children = [];
  }

  evaluate(symbolTable: SymbolTable) {
    const symbol = symbolTable.get(this.value);

    if (symbol.value === null) {
      throw new Error(`Cannot evaluate uninitialized symbol ${this.value}`);
    }

    return {
      type: symbol.type,
      value: symbol.value,
    };
  }

  generate(symbolTable: SymbolTable) {
    const sym = symbolTable.get(this.value);
    if (sym.offset == null) {
      throw new Error(`No offset recorded for variable '${this.value}'`);
    }
    
    codeInstance.append(`mov eax, [ebp-${sym.offset}] ;`);
  }
}

export class Block implements TreeNode<null> {
  id: number;
  value: null;
  children: GenericTreeNode[];

  constructor({ children }: { children: GenericTreeNode[] }) {
    this.id = nodeIdService.getId();
    nodeIdService.increment();
    this.value = null;
    this.children = children;
  }

  evaluate(symbolTable: SymbolTable) {
    this.children.forEach((child) => {
      child.evaluate(symbolTable);
    });

    return {
      type: SymbolType.INT,
      value: 0,
    };
  }

  generate(symbolTable: SymbolTable) {
    this.children.forEach((child) => {
      child.generate(symbolTable);
    });
  }
}

export class Print implements TreeNode<null> {
  id: number;
  value: null;
  children: GenericTreeNode[];

  constructor({ children }: { children: GenericTreeNode[] }) {
    this.id = nodeIdService.getId();
    nodeIdService.increment();
    this.value = null;
    this.children = children;
  }

  evaluate(symbolTable: SymbolTable) {
    const child = this.children[0];
    // console.log("--->", symbolTable)
    console.log(child.evaluate(symbolTable).value);
    return {
      type: SymbolType.INT,
      value: 0,
    };
  }

  generate(symbolTable: SymbolTable): void {
    const expr = this.children[0];

    expr.generate(symbolTable);
    codeInstance.append(`push eax ;`);
    codeInstance.append(`push format_out ;`);
    codeInstance.append(`call printf ;`);
    codeInstance.append(`add esp, 8 ;`);
  }
}

export class Assignment implements TreeNode<null> {
  id: number;
  value: null;
  children: GenericTreeNode[];

  constructor({ children }: { children: GenericTreeNode[] }) {
    this.id = nodeIdService.getId();
    nodeIdService.increment();
    this.value = null;
    this.children = children;
  }

  evaluate(symbolTable: SymbolTable) {
    const [firstChild, secondChild] = this.children;
    if (typeof firstChild.value !== "string") {
      throw new Error("Cannot assign to literal");
    }

    const secondChildSymbol = secondChild.evaluate(symbolTable);
    symbolTable.setSymbol(firstChild.value, secondChildSymbol);

    return {
      type: SymbolType.INT,
      value: 0,
    };
  }

  generate(symbolTable: SymbolTable) {
    const [firstChild, secondChild] = this.children;
    if (typeof firstChild.value !== "string") {
      throw new Error("Cannot assign to literal");
    }

    secondChild.generate(symbolTable);

    const sym = symbolTable.get(firstChild.value);
    if (sym.offset == null) {
      throw new Error(`No offset recorded for variable '${firstChild.value}'`);
    }

    // 4) emit the store instruction
    codeInstance.append(`mov [ebp-${sym.offset}], eax ;`);
  }
}

export class VarDec implements TreeNode<SymbolType> {
  id: number;
  value: SymbolType;
  children: GenericTreeNode[];

  constructor({
    children,
    value,
  }: {
    children: GenericTreeNode[];
    value: SymbolType;
  }) {
    this.id = nodeIdService.getId();
    nodeIdService.increment();
    this.value = value;
    this.children = children;
  }

  evaluate(symbolTable: SymbolTable) {
    if (this.children.length === 1) {
      const child = this.children[0];
      if (typeof child.value !== "string") {
        throw new Error("Cannot assign to literal");
      }

      symbolTable.declare(child.value, this.value);
    } else {
      const [firstChild, secondChild] = this.children;
      if (typeof firstChild.value !== "string") {
        throw new Error("Cannot assign to literal");
      }

      const secondChildSymbol = secondChild.evaluate(symbolTable);
      if (secondChildSymbol.type !== this.value) {
        throw new Error(
          `Cannot assign ${secondChildSymbol.type} to ${this.value} variable`
        );
      }

      symbolTable.declare(firstChild.value, secondChildSymbol.type);
      symbolTable.setSymbol(firstChild.value, secondChildSymbol);
    }

    return {
      type: SymbolType.INT,
      value: 0,
    };
  }

  generate(symbolTable: SymbolTable) {
    const idNode = this.children[0];
    if (typeof idNode.value !== "string") {
      throw new Error("Cannot declare a non-identifier");
    }

    symbolTable.declare(idNode.value, this.value);
    codeInstance.append(`sub esp, ${BYTE_SHIFT_INCREMENT} ;`);

    if (this.children.length === 2) {
      const initExpr = this.children[1];
      initExpr.generate(symbolTable);

      const sym = symbolTable.get(idNode.value);
      if (sym.offset == null) {
        throw new Error(`No offset for variable '${this.value}'`);
      }

      codeInstance.append(`mov [ebp-${sym.offset}], eax ;`);
    }
  }
}

export class While implements TreeNode<null> {
  id: number;
  value: null;
  children: GenericTreeNode[];

  constructor({ children }: { children: GenericTreeNode[] }) {
    this.id = nodeIdService.getId();
    nodeIdService.increment();
    this.value = null;
    this.children = children;
  }

  evaluateAndCheckIfBoolean(node: GenericTreeNode, symbolTable: SymbolTable) {
    const conditionSymbol = node.evaluate(symbolTable);
    if (conditionSymbol.type !== SymbolType.BOOL) {
      throw new Error(
        `Cannot compute condition with type ${conditionSymbol.type}`
      );
    }

    return conditionSymbol.value as boolean;
  }

  evaluate(symbolTable: SymbolTable) {
    const [firstChild, secondChild] = this.children;

    while (this.evaluateAndCheckIfBoolean(firstChild, symbolTable)) {
      secondChild.evaluate(symbolTable);
    }

    return {
      type: SymbolType.INT,
      value: 0,
    };
  }

  generate(symbolTable: SymbolTable): void {
    const [firstChild, secondChild] = this.children;

    const loopLabel = `loop_${this.id}`;
    const exitLabel = `exit_${this.id}`;

    codeInstance.append(`${loopLabel}:`);
    firstChild.generate(symbolTable);
    codeInstance.append(`cmp eax, 0 ;`);
    codeInstance.append(`je  ${exitLabel} ;`);
    secondChild.generate(symbolTable);
    codeInstance.append(`jmp ${loopLabel} ;`);
    codeInstance.append(`${exitLabel}:`);
  }
}

export class If implements TreeNode<null> {
  id: number;
  value: null;
  children: GenericTreeNode[];

  constructor({ children }: { children: GenericTreeNode[] }) {
    this.id = nodeIdService.getId();
    nodeIdService.increment();
    this.value = null;
    this.children = children;
  }

  evaluate(symbolTable: SymbolTable) {
    const [condition, ifBlock, elseBlock] = this.children;

    const conditionSymbol = condition.evaluate(symbolTable);
    if (conditionSymbol.type !== SymbolType.BOOL) {
      throw new Error(
        `Cannot compute condition with type ${conditionSymbol.type}`
      );
    }

    if (conditionSymbol.value) {
      ifBlock.evaluate(symbolTable);
    } else if (isTruthy(elseBlock)) {
      elseBlock.evaluate(symbolTable);
    }

    return {
      type: SymbolType.INT,
      value: 0,
    };
  }

  generate(symbolTable: SymbolTable): void {
    const [condition, ifBlock, elseBlock] = this.children;

    const elseLabel = `else_${this.id}`;
    const exitLabel = `exit_${this.id}`;

    condition.generate(symbolTable);
    codeInstance.append(`cmp eax, 0 ;`);
    if (isTruthy(elseBlock)) {
      codeInstance.append(`je  ${elseLabel} ;`);
    } else {
      codeInstance.append(`je  ${exitLabel} ;`);
    }

    ifBlock.generate(symbolTable);
    codeInstance.append(`jmp ${exitLabel} ;`);

    if (isTruthy(elseBlock)) {
      codeInstance.append(`${elseLabel}:`);
      elseBlock.generate(symbolTable);
    }

    codeInstance.append(`${exitLabel}:`);
  }
}

export class Scan implements TreeNode<null> {
  // private static input: Input = new Input("syncprompt");

  id: number;
  value: null;
  children: GenericTreeNode[];

  constructor() {
    this.id = nodeIdService.getId();
    nodeIdService.increment();
    this.value = null;
    this.children = [];
  }

  evaluate(_: SymbolTable) {
    return {
      type: SymbolType.INT,
      // value: Number(Scan.input.get()),
      value: 0,
    };
  }

  generate(): void {
    codeInstance.append(`push scan_int ;`);
    codeInstance.append(`push format_in ;`);
    codeInstance.append(`call scanf ;`);
    codeInstance.append(`add esp, 8 ;`);
    codeInstance.append(`mov eax, dword [scan_int] ;`);
  }
}

export class FieldDec<T = number> implements TreeNode<string> {
  id: number;
  value: string;
  children: GenericTreeNode[];

  constructor({
    value,
    children,
  }: {
    value: string;
    children: GenericTreeNode[];
  }) {
    this.id = nodeIdService.getId();
    nodeIdService.increment();
    this.value = value;
    this.children = children;
  }

  evaluate(symbolTable: SymbolTable): InitializedSymbol {
    // Field declarations are evaluated during form evaluation
    return {
      type: SymbolType.INT,
      value: 0,
    } as InitializedSymbol;
  }

  generate(symbolTable: SymbolTable) {
    // Field generation is handled by specific field types
    this.children.forEach((child) => {
      child.generate(symbolTable);
    });
  }
}

export class FieldProperty implements TreeNode<string> {
  id: number;
  value: string;
  children: GenericTreeNode[];

  constructor({
    value,
    children,
  }: {
    value: string;
    children: GenericTreeNode[];
  }) {
    this.id = nodeIdService.getId();
    nodeIdService.increment();
    this.value = value;
    this.children = children;
  }

  evaluate(symbolTable: SymbolTable): InitializedSymbol {
    // Property evaluation is handled by the field
    return {
      type: SymbolType.INT,
      value: 0,
    } as InitializedSymbol;
  }

  generate(symbolTable: SymbolTable) {
    // Property generation is handled by the field
    this.children.forEach((child) => {
      child.generate(symbolTable);
    });
  }
}

export class StringField extends FieldDec<string> {
  constructor({
    value,
    children,
  }: {
    value: string;
    children: GenericTreeNode[];
  }) {
    super({ value, children });
  }

  evaluate(symbolTable: SymbolTable) {
    // String field specific evaluation
    return {
      type: SymbolType.STRING,
      value: this.value,
    };
  }

  generate(symbolTable: SymbolTable) {
    // String field specific code generation
    super.generate(symbolTable);
  }
}

export class SelectField extends FieldDec<string> {
  constructor({
    value,
    children,
  }: {
    value: string;
    children: GenericTreeNode[];
  }) {
    super({ value, children });
  }

  evaluate(symbolTable: SymbolTable) {
    // Select field specific evaluation
    return {
      type: SymbolType.STRING,
      value: this.value,
    };
  }

  generate(symbolTable: SymbolTable) {
    // Select field specific code generation
    super.generate(symbolTable);
  }
}

export class CheckboxField extends FieldDec<boolean> {
  constructor({
    value,
    children,
  }: {
    value: string;
    children: GenericTreeNode[];
  }) {
    super({ value, children });
  }

  evaluate(symbolTable: SymbolTable) {
    // Checkbox field specific evaluation
    return {
      type: SymbolType.BOOL,
      value: false,
    };
  }

  generate(symbolTable: SymbolTable) {
    // Checkbox field specific code generation
    super.generate(symbolTable);
  }
}

export class FormDec implements TreeNode<string> {
  id: number;
  value: string;
  children: GenericTreeNode[];

  constructor({
    value,
    children,
  }: {
    value: string;
    children: GenericTreeNode[];
  }) {
    this.id = nodeIdService.getId();
    nodeIdService.increment();
    this.value = value;
    this.children = children;
  }

  evaluate(symbolTable: SymbolTable): InitializedSymbol {
    // Convert form fields to FormField objects
    const fields = this.children.flatMap(field => {
      if (field instanceof If) {
        // Evaluate the condition
        const condition = field.children[0].evaluate(symbolTable);
        if (condition.type !== SymbolType.BOOL) {
          throw new Error("If condition must evaluate to a boolean");
        }

        // If condition is true, evaluate the block
        if (condition.value) {
          return field.children[1].children.map(blockField => {
            if (blockField instanceof StringField) {
              return {
                type: "string_field" as const,
                name: blockField.value,
                properties: this.extractFieldProperties(blockField, symbolTable)
              };
            } else if (blockField instanceof SelectField) {
              return {
                type: "select_field" as const,
                name: blockField.value,
                properties: this.extractFieldProperties(blockField, symbolTable)
              };
            } else if (blockField instanceof CheckboxField) {
              return {
                type: "checkbox_field" as const,
                name: blockField.value,
                properties: this.extractFieldProperties(blockField, symbolTable)
              };
            }
            throw new Error("Invalid field type in if block");
          });
        }
        return []; // Return empty array if condition is false
      } else if (field instanceof While) {
        // Evaluate the condition
        const condition = field.children[0].evaluate(symbolTable);
        if (condition.type !== SymbolType.BOOL) {
          throw new Error("While condition must evaluate to a boolean");
        }

        // Create a new symbol table for the loop block to handle variable scoping
        const loopSymbolTable = new SymbolTable();
        Object.assign(loopSymbolTable, symbolTable); // Copy existing symbols

        // Execute the loop and collect fields
        const blockFields: FormField[] = [];
        let loopCondition = condition.value;
        let iterationCount = 1;
        
        while (loopCondition) {
          // Evaluate the block
          field.children[1].evaluate(loopSymbolTable);
          
          // Get the fields from the block's children
          for (const blockChild of field.children[1].children) {
            if (blockChild instanceof StringField) {
              blockFields.push({
                type: "string_field" as const,
                name: `${blockChild.value}_${iterationCount}`,
                properties: this.extractFieldProperties(blockChild, loopSymbolTable)
              });
            } else if (blockChild instanceof SelectField) {
              blockFields.push({
                type: "select_field" as const,
                name: `${blockChild.value}_${iterationCount}`,
                properties: this.extractFieldProperties(blockChild, loopSymbolTable)
              });
            } else if (blockChild instanceof CheckboxField) {
              blockFields.push({
                type: "checkbox_field" as const,
                name: `${blockChild.value}_${iterationCount}`,
                properties: this.extractFieldProperties(blockChild, loopSymbolTable)
              });
            } else if (blockChild instanceof Assignment) {
              // Skip assignments as they're handled by evaluate
              continue;
            } else {
              throw new Error(`Invalid field type in while block: ${blockChild.constructor.name}`);
            }
          }

          // Re-evaluate the condition
          loopCondition = field.children[0].evaluate(loopSymbolTable).value;
          iterationCount++;
        }

        return blockFields;
      } else if (field instanceof StringField) {
        return [{
          type: "string_field" as const,
          name: field.value,
          properties: this.extractFieldProperties(field, symbolTable)
        }];
      } else if (field instanceof SelectField) {
        return [{
          type: "select_field" as const,
          name: field.value,
          properties: this.extractFieldProperties(field, symbolTable)
        }];
      } else if (field instanceof CheckboxField) {
        return [{
          type: "checkbox_field" as const,
          name: field.value,
          properties: this.extractFieldProperties(field, symbolTable)
        }];
      }
      throw new Error("Invalid field type");
    });

    // Store the form definition
    formStore.addForm({
      name: this.value,
      fields
    });

    // Return a default value to satisfy the TreeNode interface
    return {
      type: SymbolType.INT,
      value: 0
    };
  }

  private extractFieldProperties(field: StringField | SelectField | CheckboxField, symbolTable: SymbolTable) {
    const properties: any = {
      label: "",
      required: false,
      placeholder: "",
      options: []
    };
    
    field.children.forEach(prop => {
      if (prop instanceof FieldProperty) {
        const propName = prop.value;
        const propValue = prop.children;

        if (propName === "options") {
          // Handle options array specifically
          properties[propName] = propValue.map(node => {
            if (node instanceof StringVal) {
              return node.value;
            } else if (node instanceof Identifier) {
              // Evaluate the identifier to get its value
              const symbol = node.evaluate(symbolTable);
              if (symbol.type === SymbolType.STRING) {
                return symbol.value;
              }
              return "";
            }
            return "";
          }).filter(Boolean);
        } else if (propValue[0] instanceof StringVal) {
          properties[propName] = propValue[0].value;
        } else if (propValue[0] instanceof BoolVal) {
          properties[propName] = propValue[0].value;
        }
      }
    });

    return properties;
  }

  generate(symbolTable: SymbolTable): void {
    // No code generation needed for forms
  }
}
