import {
  Metadata,
  File,
  AdditionalInformation,
  ServiceMetadata
} from '@oceanprotocol/lib'
import { DataTokenOptions, PriceOptions } from '@oceanprotocol/react'
import {
  IEwaiAdditionalInfoForOcean,
  IEwaiAssetFormFields,
  IEwaiLookupAssetResult
} from '../ewai/client/ewai-js'

export interface AdditionalInformationMarket extends AdditionalInformation {
  links?: File[]
  termsAndConditions: boolean
  // ---- ewai fields ----
  energyweb: IEwaiAdditionalInfoForOcean
}

export interface MetadataMarket extends Metadata {
  // While required for this market, Aquarius/Plecos will keep this as optional
  // allowing external pushes of assets without `additionalInformation`.
  // Making it optional here helps safeguarding against those assets.
  additionalInformation?: AdditionalInformationMarket
  ewaiAsset?: IEwaiLookupAssetResult
}

export interface PriceOptionsMarket extends PriceOptions {
  weightOnOcean: string
  // easier to keep this as number for Yup input validation
  swapFee: number
}

export interface MetadataPublishForm extends IEwaiAssetFormFields {
  // ---- required fields ----
  name: string
  description: string
  files: string | File[]
  author: string
  dataTokenOptions: DataTokenOptions
  access: 'Download' | 'Compute' | string
  termsAndConditions: boolean
  // ---- optional fields ----
  tags?: string
  links?: string | File[]
}

export interface ServiceMetadataMarket extends ServiceMetadata {
  attributes: MetadataMarket
}
