import { ServiceComputeOptions } from '@oceanprotocol/lib'

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

  [key: string]: any
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
