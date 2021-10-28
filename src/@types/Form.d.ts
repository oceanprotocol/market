interface FormFieldContent {
  label: string
  name: string
  type?: string
  options?: string[]
  sortOptions?: boolean
  required?: boolean
  multiple?: boolean
  disabled?: boolean
  help?: string
  placeholder?: string
  pattern?: string
  min?: string
  disclaimer?: string
  disclaimerValues?: string[]
  advanced?: boolean
}

interface FormStepContent {
  title: string
  description?: string
  fields: FormFieldContent[]
}
