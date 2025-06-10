export enum TokenType {
  // Primitives
  INT = "INT",
  STRING = "STRING",
  BOOL = "BOOL",

  // Type declarations
  VAR = "VAR",
  TYPE = "TYPE",

  // Operations
  PLUS = "PLUS",
  MINUS = "MINUS",
  X = "X",
  DIVIDE = "DIVIDE",

  // Boolean operators
  NOT = "NOT",
  AND = "AND",
  OR = "OR",

  // Comparison operators
  EQUALS = "EQUALS",
  GREATER_THAN = "GREATER_THAN",
  LESS_THAN = "LESS_THAN",

  // Brackets
  OPEN_PAR = "OPEN_PAR",
  CLOSE_PAR = "CLOSE_PAR",
  OPEN_BRACKET = "OPEN_BRACKET",
  CLOSE_BRACKET = "CLOSE_BRACKET",

  // Blocks
  OPEN_BRAC = "OPEN_BRAC",
  CLOSE_BRAC = "CLOSE_BRAC",

  // Assignment
  ASSIGNMENT = "ASSIGNMENT",
  IDENTIFIER = "IDENTIFIER",

  // Conditional statements
  IF = "IF",
  ELSE = "ELSE",
  WHILE = "WHILE",

  // Built-ins
  PRINTLN = "PRINTLN",
  READ = "READ",

  // Form-related tokens
  FORM = "FORM",
  STRING_FIELD = "STRING_FIELD",
  SELECT_FIELD = "SELECT_FIELD",
  CHECKBOX_FIELD = "CHECKBOX_FIELD",

  // Punctuation
  COLON = "COLON",
  COMMA = "COMMA",

  // New line
  NEW_LINE = "NEW_LINE",

  // EOF
  EOF = "EOF",
}

export enum TokenRepresentation {
  // Operations
  PLUS = "+",
  MINUS = "-",
  X = "*",
  DIVIDE = "/",

  // Boolean primitives
  TRUE = "true",
  FALSE = "false",

  // Boolean operators
  NOT = "!",
  AND = "&&",
  OR = "||",

  // Comparison operators
  EQUALS = "==",
  GREATER_THAN = ">",
  LESS_THAN = "<",

  // Brackets
  OPEN_PAR = "(",
  CLOSE_PAR = ")",
  OPEN_BRACKET = "[",
  CLOSE_BRACKET = "]",

  // Quotes
  QUOTE = "\"",

  // Blocks
  OPEN_BRAC = "{",
  CLOSE_BRAC = "}",

  // Assignment
  ASSIGNMENT = "=",

  // Punctuation
  COLON = ":",
  COMMA = ",",

  // Conditional statements
  IF = "if",
  ELSE = "else",
  WHILE = "for",

  // Built-ins
  PRINT = "Println",
  READ = "Scan",
  VAR = "var",

  // Types
  INT = "int",
  STR = "string",
  BOOL = "bool",

  // Form-related keywords
  FORM = "form",
  STRING_FIELD = "string_field",
  SELECT_FIELD = "select_field",
  CHECKBOX_FIELD = "checkbox_field",

  // New line
  NEW_LINE = "\n",
}
