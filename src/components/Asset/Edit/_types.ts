// import { EditableMetadataLinks } from '@oceanprotocol/lib'

export interface MetadataEditForm {
  name: string
  description: string
  timeout: number
  price?: string
  links?: string | any[]
  author?: string
}
