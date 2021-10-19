import {
  Metadata,
  AdditionalInformation,
  EditableMetadataLinks
} from '@oceanprotocol/lib'

// declaring into global scope to be able to use this as
// ambiant types despite the above imports
declare global {
  interface AdditionalInformationMarket extends AdditionalInformation {
    termsAndConditions: boolean
  }

  interface MetadataMarket extends Metadata {
    // While required for this market, Aquarius/Plecos will keep this as optional
    // allowing external pushes of assets without `additionalInformation`.
    // Making it optional here helps safeguarding against those assets.
    additionalInformation?: AdditionalInformationMarket
  }

  interface MetadataEditForm {
    name: string
    description: string
    timeout: string
    price?: number
    links?: string | EditableMetadataLinks[]
    author?: string
  }
}
