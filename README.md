# The Pato Programming Language 🦆

Don't mind the duck. Pato is a declarative programming language to generate beautiful forms with shadcn/ui, React Hook Form and Zod. Under the hood, Pato scripts are compiled end-to-end into fully-type-safe React + TypeScript components.

Pato features:
- Variable declarations with mandatory type annotations
-	Conditional logic support
- Loop constructs

## Example code
```pato
let meals: Array<String> = ["Chicken", "Beef", "Vegetarian"]
let maxGuests: Number    = 3

form BirthdayRSVP {
  metadata {
    heading = "Birthday RSVP"
  }

  fields {
    StringField "name" {
      label       = "Name"
      placeholder = "Enter your full name"
      required    = true
    }

    EmailField "email" {
      label       = "Email"
      placeholder = "Enter your email address"
      required    = true
    }

    StringField "phone" {
      label       = "Phone Number"
      placeholder = "Enter your phone number"
      required    = true
    }

    SelectField "mealChoice" {
      label       = "Meal Choice"
      placeholder = "Select your meal"
      options {
        loop meal in meals {
          Option {
            label = meal
            value = meal.toLowerCase()
          }
        }
      }
    }

    CheckboxField "willAttend" {
      label       = "Will you attend?"
      description = "Check if you will attend the birthday party"
    }

    if willAttend.answer {
      loop i from 1 to maxGuests {
        StringField "guest\(i)" {
          label       = "Guest #\(i) Name"
          placeholder = "Enter guest \(i)’s name"
        }
      }
    }

    loop i from 1 to 2 {
      StringField "note\(i)" {
        label       = "Additional Note \(i)"
        placeholder = "Enter note #\(i)"
      }
    }
  }
}
```


## EBNF

```ebnf
FORM_SCRIPT    = { TOP_LEVEL_DECL } ;

TOP_LEVEL_DECL = LET_DECL | FORM_DECL ;

LET_DECL      = "let" IDENTIFIER ":" TYPE "=" LITERAL_LIST ;

FORM_DECL     = "form" IDENTIFIER "{"
  METADATA_BLOCK
  FIELDS_BLOCK
"}" ;

METADATA_BLOCK = "metadata" "{"
  { META_PROP }
"}" ;

META_PROP     = IDENTIFIER "=" LITERAL ;

FIELDS_BLOCK  = "fields" "{"
  { FIELD_DECL }
"}" ;

FIELD_DECL    = FieldKind IDENTIFIER "{"
  { FIELD_PROP }
  [ OPTIONS_BLOCK ]
  [ CONDITIONAL_BLOCK ]
  [ LOOP_BLOCK ]
"}" ;

FieldKind     = "StringField" | "EmailField" | "SelectField" | "CheckboxField" ;

FIELD_PROP    = IDENTIFIER "=" ( LITERAL | BOOLEAN ) ;

OPTIONS_BLOCK = "options" "{"
  LOOP_BLOCK
"}" ;

CONDITIONAL_BLOCK = "if" CONDITION "{"
  { FIELD_DECL }
"}" ;

LOOP_BLOCK    = "loop" LOOP_HEADER "{"
  { FIELD_DECL }
"}" ;

LOOP_HEADER   = IDENTIFIER "in" IDENTIFIER | IDENTIFIER "from" NUMBER "to" IDENTIFIER ;

CONDITION     = IDENTIFIER "." "answer"
(
("==" | "!=" | ">" | "<" | ">=" | "<=") ( LITERAL | IDENTIFIER )
) ? ;

TYPE          = "Array<" SimpleType ">" | SimpleType ;

SimpleType    = "String" | "Number" | "Boolean" ;

LITERAL_LIST  = "[" [ LITERAL { "," LITERAL } ] "]" ;

LITERAL       = STRING | NUMBER ;

IDENTIFIER    = letter { letter | digit | "_" } ;

STRING        = '"' { character_except_quote } '"' ;

NUMBER        = digit { digit } ;

BOOLEAN       = "true" | "false" ;

letter        = ? A–Z or a–z ? ;
digit         = ? 0–9 ? ;
character_except_quote = ? [^"\n] ? ;
```