import { BoxSelectionOption } from '../components/molecules/FormFields/BoxSelection'

export interface FormFieldProps {
  label: string
  name: string
  type?: string
  options?: string[] | BoxSelectionOption
  sortOptions?: boolean
  required?: boolean
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
