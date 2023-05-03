import {
  FileInfo,
  MetadataAlgorithm,
  ServiceComputeOptions
} from '@oceanprotocol/lib'
import { NftMetadata } from '@utils/nft'
import { ReactElement } from 'react'
export interface FormPublishService {
  files: FileInfo[]
  links?: FileInfo[]
  timeout: string
  dataTokenOptions: { name: string; symbol: string }
  access: 'Download' | 'Compute' | string
  providerUrl: { url: string; valid: boolean; custom: boolean }
  algorithmPrivacy?: boolean
  computeOptions?: ServiceComputeOptions
  usesConsumerParameters?: boolean
  consumerParameters?: AlgorithmConsumerParameter[]
}

export interface FormPublishData {
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
    termsAndConditions: boolean
    tags?: string[]
    dockerImage?: string
    dockerImageCustom?: string
    dockerImageCustomTag?: string
    dockerImageCustomEntrypoint?: string
    dockerImageCustomChecksum?: string
    usesConsumerParameters?: boolean
    consumerParameters?: AlgorithmConsumerParameter[]
  }
  services: FormPublishService[]
  pricing: PricePublishOptions
  feedback?: PublishFeedback
}

export interface StepContent {
  step: number
  title: string
  component: ReactElement
}

export interface PublishFeedback {
  [key: string]: {
    name: string
    description: string
    status: 'success' | 'error' | 'pending' | 'active' | string
    txCount: number
    errorMessage?: string
    txHash?: string
  }
}

export interface MetadataAlgorithmContainer {
  entrypoint: string
  image: string
  tag: string
  checksum: string
}

export type AlgorithmConsumerParameterType =
  | 'number'
  | 'text'
  | 'boolean'
  | 'select'

export interface AlgorithmConsumerParameter {
  name: string
  type: AlgorithmConsumerParameterType
  label: string
  required: boolean | string
  description: string
  default: string | boolean | number
  options?: string | { [key: string]: string }[]
}

export type MetadataAlgorithmExtended = MetadataAlgorithm & {
  consumerParameters: AlgorithmConsumerParameter[]
}
