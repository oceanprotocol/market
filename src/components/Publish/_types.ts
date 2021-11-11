import { DataTokenOptions } from '@hooks/usePublish'
import { ReactElement } from 'react'

export interface FormPublishService {
  files: string[]
  timeout: string
  dataTokenOptions: DataTokenOptions
  access: 'Download' | 'Compute' | string
  image?: string
  containerTag?: string
  entrypoint?: string
  providerUrl?: string
}

export interface FormPublishData {
  stepCurrent: number
  accountId: string
  chainId: number
  metadata: {
    type: 'dataset' | 'algorithm'
    name: string
    description: string
    author: string
    termsAndConditions: boolean
    tags?: string
    links?: string[]
  }
  services: FormPublishService[]
  pricing: PriceOptions
}

export interface StepContent {
  step: number
  title: string
  component: ReactElement
}
