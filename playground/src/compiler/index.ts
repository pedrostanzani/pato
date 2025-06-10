import { Parser } from "./modules/Parser";
import { SymbolTable } from "./modules/SymbolTable";
import { formStore } from "./modules/FormStore";
import { FormGenerator } from "./formgen/generator";

export function compile(sourceCode: string) {
  // Clear the form store before parsing new code
  formStore.clear();
  
  const ast = Parser.run(sourceCode);
  const symbolTable = new SymbolTable();
  ast.evaluate(symbolTable);

  // Get forms and generate React components
  const forms = formStore.getAllForms();
  const generatedComponents = FormGenerator.generateForms(forms);

  return {
    forms, generatedComponents
  }
};

