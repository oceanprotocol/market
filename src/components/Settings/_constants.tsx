import React from 'react'
import { allowDynamicPricing, allowFixedPricing } from '../../../app.config.js'
import { FormSettingsData, SettingsAssets } from './_types'
import contentAsset from '../../../content/settings/assets.json'
import { ServiceComputeOptions } from '@oceanprotocol/lib'

const computeOptions: ServiceComputeOptions = {
  allowRawAlgorithm: false,
  allowNetworkAccess: true,
  publisherTrustedAlgorithmPublishers: null,
  publisherTrustedAlgorithms: null
}

export const initialValues: FormSettingsData = {
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
    price: 0,
    type:
      allowDynamicPricing === 'true'
        ? 'dynamic'
        : allowFixedPricing === 'true'
        ? 'fixed'
        : 'free',
    amountDataToken: allowDynamicPricing === 'true' ? 100 : 1000,
    amountOcean: 100,
    weightOnOcean: '5', // 50% on OCEAN
    weightOnDataToken: '5', // 50% on datatoken
    swapFee: 0.1, // in %
    freeAgreement: false
  }
}

export const initialSettingsAssets: SettingsAssets = contentAsset
