# A Linguagem de Programação Pato 🦆

Pato é uma linguagem de programação específica de domínio projetada para simplificar a criação de formulários web usando React, TypeScript e shadcn/ui. Ela fornece uma sintaxe declarativa e limpa para definir formulários e gera automaticamente componentes React prontos para produção com validação de formulário, estilização e recursos de acessibilidade integrados.

Para explorar a linguagem, acesse: https://pato-playground.vercel.app/

## Características

- **Definição Declarativa de Formulários**: Defina formulários usando uma sintaxe simples e intuitiva
- **Formulários Dinâmicos**: Crie formulários dinâmicos com loops e lógica condicional
- **Componentes UI Modernos**: Integração com shadcn/ui para componentes bonitos e acessíveis
- **Validação de Formulários**: Geração automática de esquemas Zod para validação robusta
- **Campos Condicionais**: Suporte para campos de formulário condicionais baseados na entrada do usuário
- **Integração React**: Integração perfeita com React e React Hook Form

## Exemplo

Aqui está um exemplo simples de um formulário de RSVP para aniversário em Pato:

```pato
{
  var is_adult bool = true
  var has_plus_one bool = true
  var number_of_kids int = 2
  var counter int = 0

  form BirthdayRSVP {
    string_field guest_name {
      label: "Your Name"
      placeholder: "Enter your full name"
      required: true
    }

    string_field email {
      label: "Email Address"
      placeholder: "Enter your email"
      required: true
    }

    select_field attendance {
      label: "Will you attend?"
      options: ["Yes", "No", "Maybe"]
      required: true
    }

    if (is_adult) {
      select_field dietary_restrictions {
        label: "Dietary Restrictions"
        options: ["None", "Vegetarian", "Vegan", "Gluten-Free", "Other"]
        required: true
      }
    }

    if (has_plus_one) {
      string_field plus_one_name {
        label: "Plus One Name"
        placeholder: "Enter your plus one's name"
        required: true
      }

      select_field plus_one_dietary {
        label: "Plus One Dietary Restrictions"
        options: ["None", "Vegetarian", "Vegan", "Gluten-Free", "Other"]
        required: true
      }
    }

    for (counter < number_of_kids) {
      string_field child_name {
        label: "Child Name"
        placeholder: "Enter child's name"
        required: true
      }

      select_field child_dietary {
        label: "Child Dietary Restrictions"
        options: ["None", "Vegetarian", "Vegan", "Gluten-Free", "Other"]
        required: true
      }

      counter = counter + 1
    }

    string_field gift_preference {
      label: "Gift Preference"
      placeholder: "Enter your gift preference or registry link"
      required: false
    }
  }
}
```

## Como Funciona

1. **Parser**: O compilador Pato analisa suas definições de formulário em uma Árvore Sintática Abstrata (AST)
2. **Tabela de Símbolos**: Mantém o escopo das variáveis e informações de tipo
3. **Form Store**: Gerencia definições de formulário e seus relacionamentos
4. **Gerador de Formulários**: Converte definições de formulário em componentes React com:
   - Tipos TypeScript
   - Esquemas de validação Zod
   - Integração com React Hook Form
   - Componentes shadcn/ui

## Saída Gerada

O compilador gera componentes React com:
- Suporte completo ao TypeScript
- Validação de formulário usando Zod
- Componentes UI modernos do shadcn/ui
- Gerenciamento adequado do estado do formulário com React Hook Form
- Recursos de acessibilidade
- Design responsivo

## Começando

1. Instale o compilador Pato
2. Escreva suas definições de formulário em Pato
3. Compile para componentes React
4. Importe e use os componentes gerados em sua aplicação React

## Requisitos

- Node.js 22+
- React 19+
- TypeScript 5.8+

## Licença

Licença MIT - sinta-se livre para usar o Pato em seus projetos!
