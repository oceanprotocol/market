import { DataTokenOptions } from '@utils/datatokens'
import { NftOptions } from '@utils/nft'
import { ReactElement } from 'react'

export interface FormPublishService {
  files: {
    url: string
    valid: boolean
    contentLength: string
    contentType: string
  }[]
  timeout: string
  dataTokenOptions: DataTokenOptions
  access: 'Download' | 'Compute' | string
  providerUrl?: string
  algorithmPrivacy?: boolean
}

export interface FormPublishData {
  user: {
    stepCurrent: number
    accountId: string
    chainId: number
  }
  metadata: {
    nft: NftOptions
    type: 'Dataset' | 'Algorithm' | string
    name: string
    description: string
    author: string
    termsAndConditions: boolean
    tags?: string
    links?: string[]
    dockerImage?: string
    dockerImageCustom?: string
    dockerImageCustomTag?: string
    dockerImageCustomEntrypoint?: string
  }
  services: FormPublishService[]
  pricing: PriceOptions
}

export interface StepContent {
  step: number
  title: string
  component: ReactElement
}
