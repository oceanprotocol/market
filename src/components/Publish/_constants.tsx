import React from 'react'
import { allowDynamicPricing, allowFixedPricing } from '../../../app.config.js'
import { FormPublishData, StepContent } from './_types'
import content from '../../../content/publish/form.json'
import PricingFields from './Pricing'
import MetadataFields from './Metadata'
import ServicesFields from './Services'
import Preview from './Preview'

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
  }
]

export const initialValues: FormPublishData = {
  user: {
    stepCurrent: 1,
    chainId: 1,
    accountId: ''
  },
  metadata: {
    nft: { name: '', symbol: '', description: '', image: '' },
    type: 'dataset',
    name: '',
    author: '',
    description: '',
    tags: '',
    termsAndConditions: false,
    dockerImage: '',
    dockerImageCustom: '',
    dockerImageCustomTag: '',
    dockerImageCustomEntrypoint: ''
  },
  services: [
    {
      files: [{ url: '' }],
      links: [{ url: '' }],
      dataTokenOptions: { name: '', symbol: '' },
      timeout: '',
      access: '',
      providerUrl: 'https://provider.mainnet.oceanprotocol.com'
    }
  ],
  pricing: {
    price: 1,
    type:
      allowDynamicPricing === 'true'
        ? 'dynamic'
        : allowFixedPricing === 'true'
        ? 'fixed'
        : 'free',
    amountDataToken: allowDynamicPricing === 'true' ? 50 : 1000,
    amountOcean: 50,
    weightOnOcean: '5', // 50% on OCEAN
    weightOnDataToken: '5', // 50% on datatoken
    swapFee: 0.1 // in %
  }
}

// export const initialValuesAlgo: Partial<MetadataPublishFormAlgorithm> = {
//   name: '',
//   author: '',
//   dataTokenOptions: {
//     name: '',
//     symbol: ''
//   },
//   dockerImage: 'node:latest',
//   image: 'node',
//   containerTag: 'latest',
//   entrypoint: 'node $ALGO',
//   files: '',
//   description: '',
//   algorithmPrivacy: false,
//   termsAndConditions: false,
//   tags: '',
//   timeout: 'Forever',
//   providerUri: ''
// }
