import { Metadata } from '@oceanprotocol/lib'
import { AdditionalInformation } from '@oceanprotocol/lib/dist/node/ddo/interfaces/AdditionalInformation'
import { File } from '@oceanprotocol/lib/dist/node/ddo/interfaces/File'
import { ServiceMetadata } from '@oceanprotocol/lib/dist/node/ddo/interfaces/Service'

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
  cost: string
  access: string
  termsAndConditions: boolean
  // ---- optional fields ----
  copyrightHolder?: string
  tags?: string
  links?: string | File[]
}

export interface ServiceMetadataMarket extends ServiceMetadata {
  attributes: MetadataMarket
}
