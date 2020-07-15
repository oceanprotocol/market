import { File, MetaData, AdditionalInformation } from '@oceanprotocol/lib'
import { ServiceMetadata } from '@oceanprotocol/lib/dist/node/ddo/Service'

export declare type AccessType = 'Download' | 'Compute'

export interface AdditionalInformationMarket extends AdditionalInformation {
  description: string
  links?: File[] // redefine existing key, cause not specific enough in Squid
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
  links?: string | File[]
}

export interface ServiceMetaDataMarket extends ServiceMetadata {
  attributes: MetaDataMarket
}
