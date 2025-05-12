%{
#include "pato.tab.h"
#include <stdlib.h>
%}
%%
"let"             return LET;
"form"            return FORM;
"metadata"        return METADATA;
"fields"          return FIELDS;
"StringField"     return STRINGFIELD;
"EmailField"      return EMAILFIELD;
"SelectField"     return SELECTFIELD;
"CheckboxField"   return CHECKBOXFIELD;
"options"         return OPTIONS;
"loop"            return LOOP;
"if"              return IF;
"in"              return IN;
"from"            return FROM;
"to"              return TO;

"true"            { yylval.booleanVal = 1; return BOOLEAN_LITERAL; }
"false"           { yylval.booleanVal = 0; return BOOLEAN_LITERAL; }

[0-9]+            { yylval.intVal = atoi(yytext); return NUMBER; }

\"([^\"\\]|\\.)*\"    { yylval.strVal = strdup(yytext); return STRING; }

[A-Za-z_][A-Za-z0-9_]*    { yylval.strVal = strdup(yytext); return IDENTIFIER; }

"=="              return EQ;
"!="              return NE;
">="              return GE;
"<="              return LE;
">"               return GT;
"<"               return LT;

":"               return COLON;
"="               return ASSIGN;
","               return COMMA;
"{"               return LBRACE;
"}"               return RBRACE;
"["               return LBRACKET;
"]"               return RBRACKET;
"("               return LPAR;
")"               return RPAR;
"."               return DOT;

[ \t\r\n]+        /* skip whitespace */
.                 /* skip any other character */
%%

int yywrap(void) {
    return 1;
}