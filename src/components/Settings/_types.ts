import { ServiceComputeOptions } from '@oceanprotocol/lib'
import { NftMetadata } from '@utils/nft'
import { PriceOptions } from 'src/@types/Price'

interface FileInfo {
  url: string
  valid?: boolean
  contentLength?: string
  contentType?: string
}

export interface FormSettingsService {
  files: FileInfo[]
  links?: FileInfo[]
  timeout: string
  dataTokenOptions: { name: string; symbol: string }
  access: 'Download' | 'Compute' | string
  providerUrl: { url: string; valid: boolean; custom: boolean }
  algorithmPrivacy?: boolean
  computeOptions?: ServiceComputeOptions
}

export interface FormSettingsData {
  user: {
    stepCurrent: number
    accountId: string
    chainId: number
  }
  metadata: {
    nft: NftMetadata
    transferable: boolean
    type: 'dataset' | 'algorithm'
    name: string
    description: string
    author: string
    status: string
    termsAndConditions: boolean
    tags?: string
    dockerImage?: string
    dockerImageCustom?: string
    dockerImageCustomTag?: string
    dockerImageCustomEntrypoint?: string
    dockerImageCustomChecksum?: string
  }
  services: FormSettingsService[]
  pricing: PriceOptions
  assets?: SettingsAssets
}

export interface SettingsAssets {
  [key: string]: {
    name: string
    description: string
    status: string
    display: string
    number: string
    options: []
  }
}

export interface InputItem {
  [key: string]: string | boolean | number
}
