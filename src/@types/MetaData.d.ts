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

export interface AdditionalInformationMarket extends AdditionalInformation {
  description: string
  links?: Sample[] // redefine existing key, cause not specific enough in Squid
  deliveryType: DeliveryType
  termsAndConditions: boolean
  dateRange?: [string, string]
  supportName?: string
  supportEmail?: string
  access: AccessType
}

export interface MetaDataMarket extends MetaData {
  additionalInformation: AdditionalInformationMarket
}
