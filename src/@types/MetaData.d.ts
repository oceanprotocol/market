import {
  Metadata,
  File,
  AdditionalInformation,
  ServiceMetadata
} from '@oceanprotocol/lib'
import { DataTokenOptions, PriceOptions } from '@oceanprotocol/react'

export interface AdditionalInformationMarket extends AdditionalInformation {
  links?: File[]
  termsAndConditions: boolean
}

export interface MetadataMarket extends Metadata {
  // While required for this market, Aquarius/Plecos will keep this as optional
  // allowing external pushes of assets without `additionalInformation`.
  // Making it optional here helps safeguarding against those assets.
  additionalInformation?: AdditionalInformationMarket
}

export interface PriceOptionsMarket extends PriceOptions {
  weightOnOcean: string
  // easier to keep this as number for Yup input validation
  swapFee: number
}

export interface MetadataPublishForm {
  // ---- required fields ----
  name: string
  description: string
  files: string | File[]
  author: string
  timeout: string
  dataTokenOptions: DataTokenOptions
  access: 'Download' | 'Compute' | string
  termsAndConditions: boolean
  // ---- optional fields ----
  tags?: string
  links?: string | File[]
}

export interface AlgorithmPublishForm {
  // ---- required fields ----
  name: string
  description: string
  files: string | File[]
  author: string
  dockerImage: string
  algorithmPrivacy: boolean
  termsAndConditions: boolean
  // ---- optional fields ----
  tags?: string
}

export interface ServiceMetadataMarket extends ServiceMetadata {
  attributes: MetadataMarket
}
