import { DataTokenOptions } from '@hooks/usePublish'
import { EditableMetadataLinks, File } from '@oceanprotocol/lib'
import { ReactElement } from 'react'

export interface FormPublishService {
  files: string | File[]
  links?: string | EditableMetadataLinks[]
  timeout: string
  dataTokenOptions: DataTokenOptions
  access: 'Download' | 'Compute' | string
  image?: string
  containerTag?: string
  entrypoint?: string
  providerUri?: string
}

export interface FormPublishData {
  step: number
  steps: number
  type: 'dataset' | 'algorithm'
  metadata: {
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
