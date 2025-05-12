/* A Bison parser, made by GNU Bison 2.3.  */

/* Skeleton interface for Bison's Yacc-like parsers in C

   Copyright (C) 1984, 1989, 1990, 2000, 2001, 2002, 2003, 2004, 2005, 2006
   Free Software Foundation, Inc.

   This program is free software; you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation; either version 2, or (at your option)
   any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program; if not, write to the Free Software
   Foundation, Inc., 51 Franklin Street, Fifth Floor,
   Boston, MA 02110-1301, USA.  */

/* As a special exception, you may create a larger work that contains
   part or all of the Bison parser skeleton and distribute that work
   under terms of your choice, so long as that work isn't itself a
   parser generator using the skeleton or a modified version thereof
   as a parser skeleton.  Alternatively, if you modify or redistribute
   the parser skeleton itself, you may (at your option) remove this
   special exception, which will cause the skeleton and the resulting
   Bison output files to be licensed under the GNU General Public
   License without this special exception.

   This special exception was added by the Free Software Foundation in
   version 2.2 of Bison.  */

/* Tokens.  */
#ifndef YYTOKENTYPE
# define YYTOKENTYPE
   /* Put the tokens into the symbol table, so that GDB and other debuggers
      know about them.  */
   enum yytokentype {
     IDENTIFIER = 258,
     STRING = 259,
     NUMBER = 260,
     BOOLEAN_LITERAL = 261,
     LET = 262,
     FORM = 263,
     METADATA = 264,
     FIELDS = 265,
     OPTIONS = 266,
     LOOP = 267,
     IF = 268,
     IN = 269,
     FROM = 270,
     TO = 271,
     STRINGFIELD = 272,
     EMAILFIELD = 273,
     SELECTFIELD = 274,
     CHECKBOXFIELD = 275,
     EQ = 276,
     NE = 277,
     GT = 278,
     LT = 279,
     GE = 280,
     LE = 281,
     COLON = 282,
     ASSIGN = 283,
     COMMA = 284,
     LBRACE = 285,
     RBRACE = 286,
     LBRACKET = 287,
     RBRACKET = 288,
     LPAR = 289,
     RPAR = 290,
     DOT = 291
   };
#endif
/* Tokens.  */
#define IDENTIFIER 258
#define STRING 259
#define NUMBER 260
#define BOOLEAN_LITERAL 261
#define LET 262
#define FORM 263
#define METADATA 264
#define FIELDS 265
#define OPTIONS 266
#define LOOP 267
#define IF 268
#define IN 269
#define FROM 270
#define TO 271
#define STRINGFIELD 272
#define EMAILFIELD 273
#define SELECTFIELD 274
#define CHECKBOXFIELD 275
#define EQ 276
#define NE 277
#define GT 278
#define LT 279
#define GE 280
#define LE 281
#define COLON 282
#define ASSIGN 283
#define COMMA 284
#define LBRACE 285
#define RBRACE 286
#define LBRACKET 287
#define RBRACKET 288
#define LPAR 289
#define RPAR 290
#define DOT 291




#if ! defined YYSTYPE && ! defined YYSTYPE_IS_DECLARED
typedef union YYSTYPE
#line 7 "pato.y"
{
  int intVal;
  char* strVal;
  int booleanVal;
}
/* Line 1529 of yacc.c.  */
#line 127 "pato.tab.h"
	YYSTYPE;
# define yystype YYSTYPE /* obsolescent; will be withdrawn */
# define YYSTYPE_IS_DECLARED 1
# define YYSTYPE_IS_TRIVIAL 1
#endif

extern YYSTYPE yylval;

