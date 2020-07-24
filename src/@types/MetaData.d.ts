import {
  Metadata,
  File,
  AdditionalInformation,
  ServiceMetadata
} from '@oceanprotocol/lib'

export declare type AccessType = 'Download' | 'Compute'

export interface AdditionalInformationMarket extends AdditionalInformation {
  links?: File[]
  termsAndConditions: boolean
  access: AccessType | string
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
    cost: number
    tokensToMint: number
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
