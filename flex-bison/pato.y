%{
#include <stdio.h>
#include <stdlib.h>
void yyerror(const char *s);
int yylex(void);
%}
%union {
  int intVal;
  char* strVal;
  int booleanVal;
}
%token <strVal> IDENTIFIER STRING
%token <intVal> NUMBER
%token <booleanVal> BOOLEAN_LITERAL
%token LET FORM METADATA FIELDS OPTIONS LOOP IF IN FROM TO
%token STRINGFIELD EMAILFIELD SELECTFIELD CHECKBOXFIELD
%token EQ NE GT LT GE LE
%token COLON ASSIGN COMMA LBRACE RBRACE LBRACKET RBRACKET LPAR RPAR DOT
%type <strVal> TYPE
%%
script:
    /* empty */
  | script top_level_decl
  ;

top_level_decl:
    let_decl
  | form_decl
  ;

let_decl:
    LET IDENTIFIER COLON TYPE ASSIGN literal_list
  ;

form_decl:
    FORM IDENTIFIER LBRACE metadata_block fields_block RBRACE
  ;

metadata_block:
    METADATA LBRACE meta_props RBRACE
  ;

meta_props:
    /* empty */
  | meta_props meta_prop
  ;

meta_prop:
    IDENTIFIER ASSIGN literal
  ;

fields_block:
    FIELDS LBRACE field_decls RBRACE
  ;

field_decls:
    /* empty */
  | field_decls field_decl
  ;

field_decl:
    field_kind IDENTIFIER LBRACE field_props opt_blocks RBRACE
  ;

field_kind:
    STRINGFIELD
  | EMAILFIELD
  | SELECTFIELD
  | CHECKBOXFIELD
  ;

field_props:
    /* empty */
  | field_props field_prop
  ;

field_prop:
    IDENTIFIER ASSIGN literal
  | IDENTIFIER ASSIGN BOOLEAN_LITERAL
  ;

opt_blocks:
    /* empty */
  | opt_blocks options_block
  | opt_blocks conditional_block
  | opt_blocks loop_block
  ;

options_block:
    OPTIONS LBRACE loop_block RBRACE
  ;

conditional_block:
    IF condition LBRACE field_decls RBRACE
  ;

loop_block:
    LOOP loop_header LBRACE field_decls RBRACE
  ;

loop_header:
    IDENTIFIER IN IDENTIFIER
  | IDENTIFIER FROM NUMBER TO IDENTIFIER
  ;

condition:
    IDENTIFIER DOT IDENTIFIER opt_comp
  ;

opt_comp:
    /* empty */
  | comp_op literal
  | comp_op IDENTIFIER
  ;

comp_op:
    EQ | NE | GT | LT | GE | LE
  ;

literal_list:
    LBRACKET literal_list_items RBRACKET
  ;

literal_list_items:
    /* empty */
  | literal
  | literal_list_items COMMA literal
  ;

literal:
    STRING
  | NUMBER
  ;

TYPE:
    IDENTIFIER
  ;

%%

void yyerror(const char *s) {
  fprintf(stderr, "Parse error: %s\n", s);
}

int main(void) {
  return yyparse();
}