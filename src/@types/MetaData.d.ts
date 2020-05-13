import { MetaData, AdditionalInformation, Curation } from '@oceanprotocol/squid'

declare type DeliveryType = 'files' | 'api' | 'subscription'

declare type Granularity =
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'annually'
  | 'Not updated periodically'
  | ''

export interface Sample {
  name: string
  url: string
}

export declare type AccessType = 'Download' | 'Compute'

export interface AdditionalInformationDexFreight extends AdditionalInformation {
  description: string // required for dexFreight
  categories: [string] // required for dexFreight, lock to one category only
  links?: Sample[] // redefine existing key, cause not specific enough in Squid
  deliveryType: DeliveryType
  termsAndConditions: boolean
  dateRange?: [string, string]
  granularity?: Granularity
  supportName?: string
  supportEmail?: string
  access: AccessType
}

export interface MetaDataDexFreight extends MetaData {
  additionalInformation: AdditionalInformationDexFreight
}
