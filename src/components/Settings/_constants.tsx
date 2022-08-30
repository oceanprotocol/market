import React from 'react'
import {
  allowDynamicPricing,
  allowFixedPricing,
  signalSettings
} from '../../../app.config.js'
import { FormSettingsData } from './_types'
import { ServiceComputeOptions } from '@oceanprotocol/lib'
import {
  SignalOriginItem,
  SignalSettingsItem
} from '../../@context/Signals/_types'

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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
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

export const initialSettingsAssets: SignalSettingsItem = signalSettings
export const assetSettingsValues: SignalOriginItem[] = []

export const DEFAULT_NEW_CUSTOM_SIGNAL: SignalOriginItem = {
  id: 'customSignal',
  title: 'New Custom Signal',
  description: 'Describe new signal',
  origin: '',
  isCustom: true,
  signals: [],
  listView: {
    id: 'listView',
    value: true,
    name: 'List View'
  },
  detailView: {
    id: 'detailsView',
    value: true,
    name: 'Details View'
  },
  urlParams: {
    assetIds: [],
    publisherIds: [],
    userAddresses: []
  }
}

export const DEFAULT_CUSTOM_PUBLISHER_SIGNAL: SignalOriginItem = {
  id: 'customPublisherSignal',
  title: 'Custom Publisher Signal',
  description: 'Describe new publisher signal',
  origin: '',
  ...DEFAULT_NEW_CUSTOM_SIGNAL
}
