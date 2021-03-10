export interface FormFieldProps {
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
}

export interface FormContent {
  title: string
  description?: string
  success: string
  data: FormFieldProps[]
}
