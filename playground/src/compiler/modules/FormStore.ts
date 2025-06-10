// Types for form fields
type FieldType = "string_field" | "select_field" | "checkbox_field";

interface FormField {
  type: FieldType;
  name: string;
  properties: {
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[];
  };
}

interface FormDefinition {
  name: string;
  fields: FormField[];
}

class FormStore {
  private static _instance: FormStore;
  private forms: Map<string, FormDefinition> = new Map();

  private constructor() {}

  public static getInstance(): FormStore {
    if (FormStore._instance) {
      return FormStore._instance;
    }

    const store = new FormStore();
    FormStore._instance = store;
    return store;
  }

  addForm(form: FormDefinition) {
    this.forms.set(form.name, form);
  }

  getForm(name: string): FormDefinition | undefined {
    return this.forms.get(name);
  }

  getAllForms(): FormDefinition[] {
    return Array.from(this.forms.values());
  }

  clear() {
    this.forms.clear();
  }
}

export const formStore = FormStore.getInstance(); 