import {
  DDO,
  Ocean,
  ServiceComputePrivacy,
  publisherTrustedAlgorithm as PublisherTrustedAlgorithm
} from '@oceanprotocol/lib'
import { ComputePrivacyForm } from '../models/FormEditComputeDataset'
import { AssetSelectionAsset } from '../components/molecules/FormFields/AssetSelection'
import web3 from 'web3'
import { getAssetsNames } from './aquarius'
import axios from 'axios'

export async function createTrustedAlgorithmList(
  selectedAlgorithms: string[], // list of DIDs
  ocean: Ocean
): Promise<PublisherTrustedAlgorithm[]> {
  const trustedAlgorithms = []

  for (const selectedAlgorithm of selectedAlgorithms) {
    const trustedAlgorithm = await ocean.compute.createPublisherTrustedAlgorithmfromDID(
      selectedAlgorithm
    )
    trustedAlgorithms.push(trustedAlgorithm)
  }
  return trustedAlgorithms
}

export async function transformComputeFormToServiceComputePrivacy(
  values: ComputePrivacyForm,
  ocean: Ocean
): Promise<ServiceComputePrivacy> {
  const { allowAllPublishedAlgorithms } = values
  const publisherTrustedAlgorithms = values.allowAllPublishedAlgorithms
    ? []
    : await createTrustedAlgorithmList(values.publisherTrustedAlgorithms, ocean)

  const privacy: ServiceComputePrivacy = {
    allowNetworkAccess: false,
    allowRawAlgorithm: false,
    allowAllPublishedAlgorithms,
    publisherTrustedAlgorithms
  }

  return privacy
}

export async function transformDDOToAssetSelection(
  ddoList: DDO[],
  metadataCacheUri: string,
  selectedAlgorithms?: PublisherTrustedAlgorithm[]
): Promise<AssetSelectionAsset[]> {
  const source = axios.CancelToken.source()
  const didList: string[] = []
  const priceList: any = {}
  ddoList.forEach((ddo: DDO) => {
    const did: string = web3.utils
      .toChecksumAddress(ddo.dataToken)
      .replace('0x', 'did:op:')
    didList.push(did)
    priceList[did] = ddo.price.value
  })
  const ddoNames = await getAssetsNames(didList, metadataCacheUri, source.token)
  const algorithmList: AssetSelectionAsset[] = []
  didList?.forEach((did: string) => {
    let selected = false
    selectedAlgorithms?.forEach((algorithm: PublisherTrustedAlgorithm) => {
      if (algorithm.did === did) {
        selected = true
      }
    })
    selected
      ? algorithmList.unshift({
          did: did,
          name: ddoNames[did],
          price: priceList[did],
          checked: selected
        })
      : algorithmList.push({
          did: did,
          name: ddoNames[did],
          price: priceList[did],
          checked: selected
        })
  })
  return algorithmList
}
