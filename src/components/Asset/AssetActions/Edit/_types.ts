import { EditableMetadataLinks } from '@oceanprotocol/lib'

export interface MetadataEditForm {
  name: string
  description: string
  timeout: string
  price?: number
  links?: string | EditableMetadataLinks[]
  author?: string
}
