import { AssetSelectionAsset } from '@shared/Form/FormFields/AssetSelection'

// declaring into global scope to be able to use this as
// ambiant types despite the above imports
declare global {
  interface FormFieldProps {
    label: string
    name: string
    type?: string
    options?: string[] | AssetSelectionAsset[]
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
    fields: FormFieldProps[]
  }
}
