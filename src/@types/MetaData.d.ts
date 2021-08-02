import {
  Metadata,
  File,
  AdditionalInformation,
  ServiceMetadata
} from '@oceanprotocol/lib'
import { DataTokenOptions } from '../hooks/usePublish'
import { PriceOptions } from '../hooks/usePricing'

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

export interface MetadataPublishFormDataset {
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
  links?: string | EditableMetadataLinks[]
  providerUri?: string
}

export interface MetadataPublishFormAlgorithm {
  // ---- required fields ----
  name: string
  description: string
  files: string | File[]
  author: string
  dockerImage: string
  algorithmPrivacy: boolean
  timeout: string
  dataTokenOptions: DataTokenOptions
  termsAndConditions: boolean
  // ---- optional fields ----
  image: string
  containerTag: string
  entrypoint: string
  tags?: string
  providerUri?: string
}

export interface MetadataEditForm {
  name: string
  description: string
  timeout: string
  price?: number
  links?: string | EditableMetadataLinks[]
}

export interface ServiceMetadataMarket extends ServiceMetadata {
  attributes: MetadataMarket
}
