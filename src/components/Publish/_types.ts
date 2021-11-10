import { DataTokenOptions } from '@hooks/usePublish'
import { ReactElement } from 'react'

export interface FormPublishService {
  files: string | FileMetadata[]
  links?: string[]
  timeout: string
  dataTokenOptions: DataTokenOptions
  access: 'Download' | 'Compute' | string
  image?: string
  containerTag?: string
  entrypoint?: string
  providerUrl?: string
}

export interface FormPublishData {
  step: number
  metadata: {
    type: 'dataset' | 'algorithm'
    name: string
    description: string
    author: string
    termsAndConditions: boolean
    tags?: string
  }
  services: FormPublishService[]
  pricing: PriceOptions
}

export interface StepContent {
  step: number
  title: string
  component: ReactElement
}
