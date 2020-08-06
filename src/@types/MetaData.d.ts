import {
  Metadata,
  File,
  AdditionalInformation,
  ServiceMetadata
} from '@oceanprotocol/lib'

export interface AdditionalInformationMarket extends AdditionalInformation {
  links?: File[]
  termsAndConditions: boolean
  priceType: string
}

export interface MetadataMarket extends Metadata {
  additionalInformation: AdditionalInformationMarket
}

export interface MetadataPublishForm {
  // ---- required fields ----
  name: string
  description: string
  files: string | File[]
  author: string
  license: string
  price: {
    tokensToMint: number
    type: 'simple' | 'advanced' | string
    weightOnDataToken: string
    liquidityProviderFee: string
  }
  access: 'Download' | 'Compute' | string
  termsAndConditions: boolean
  // ---- optional fields ----
  copyrightHolder?: string
  tags?: string
  links?: string | File[]
}

export interface ServiceMetadataMarket extends ServiceMetadata {
  attributes: MetadataMarket
}
