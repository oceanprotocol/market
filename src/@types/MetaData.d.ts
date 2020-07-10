import { File, MetaData, AdditionalInformation } from '@oceanprotocol/squid'
import { ServiceMetadata } from '@oceanprotocol/squid/dist/node/ddo/Service'

export interface Sample {
  name: string
  url: string
}

export declare type AccessType = 'Download' | 'Compute'

export interface AdditionalInformationMarket extends AdditionalInformation {
  description: string
  links?: Sample[] // redefine existing key, cause not specific enough in Squid
  termsAndConditions: boolean
  dateRange?: [string, string]
  access: AccessType | string
}

export interface MetaDataMarket extends MetaData {
  additionalInformation: AdditionalInformationMarket
}

export interface MetaDataPublishForm {
  // ---- required fields ----
  name: string
  description: string
  files: string | File[]
  author: string
  license: string
  price: string
  access: string
  termsAndConditions: boolean
  // ---- optional fields ----
  copyrightHolder?: string
  tags?: string
  links?: string
}

export interface ServiceMetaDataMarket extends ServiceMetadata {
  attributes: MetaDataMarket
}

// type for assets pulled into GraphQL
export interface OceanAsset extends MetaDataMarket {
  did: DID
}
