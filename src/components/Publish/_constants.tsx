import React from 'react'
import { allowFixedPricing } from '../../../app.config'
import {
  FormPublishData,
  MetadataAlgorithmContainer,
  PublishFeedback,
  StepContent
} from './_types'
import content from '../../../content/publish/form.json'
import PricingFields from './Pricing'
import MetadataFields from './Metadata'
import ServicesFields from './Services'
import Preview from './Preview'
import Submission from './Submission'
import { ServiceComputeOptions } from '@oceanprotocol/lib'
import contentFeedback from '../../../content/publish/feedback.json'

export const wizardSteps: StepContent[] = [
  {
    step: 1,
    title: content.metadata.title,
    component: <MetadataFields />
  },
  {
    step: 2,
    title: content.services.title,
    component: <ServicesFields />
  },
  {
    step: 3,
    title: content.pricing.title,
    component: <PricingFields />
  },
  {
    step: 4,
    title: content.preview.title,
    component: <Preview />
  },
  {
    step: 5,
    title: content.submission.title,
    component: <Submission />
  }
]

const computeOptions: ServiceComputeOptions = {
  allowRawAlgorithm: false,
  allowNetworkAccess: true,
  publisherTrustedAlgorithmPublishers: [],
  publisherTrustedAlgorithms: []
}

export const initialValues: FormPublishData = {
  user: {
    stepCurrent: 1,
    chainId: 1,
    accountId: ''
  },
  metadata: {
    nft: { name: '', symbol: '', description: '', image_data: '' },
    transferable: true,
    type: 'dataset',
    name: '',
    author: '',
    description: '',
    tags: [],
    termsAndConditions: false,
    dockerImage: '',
    dockerImageCustom: '',
    dockerImageCustomTag: '',
    dockerImageCustomEntrypoint: ''
  },
  services: [
    {
      files: [{ url: '', type: 'ipfs' }],
      links: [{ url: '', type: 'url' }],
      dataTokenOptions: { name: '', symbol: '' },
      timeout: '',
      access: 'access',
      providerUrl: {
        url: 'https://provider.mainnet.oceanprotocol.com',
        valid: true,
        custom: false
      },
      computeOptions
    }
  ],
  pricing: {
    baseToken: { address: '', name: '', symbol: 'OCEAN', decimals: 18 },
    price: 0,
    type: allowFixedPricing === 'true' ? 'fixed' : 'free',
    freeAgreement: false
  }
}

export const algorithmContainerPresets: MetadataAlgorithmContainer[] = [
  {
    image: 'node',
    tag: 'latest',
    entrypoint: 'node $ALGO',
    checksum: ''
  },
  {
    image: 'python',
    tag: 'latest',
    entrypoint: 'python $ALGO',
    checksum: ''
  }
]

export const initialPublishFeedback: PublishFeedback = contentFeedback
