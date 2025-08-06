import { PublisherTrustedAlgorithm, Asset } from '@oceanprotocol/ddo-js'
import { AssetSelectionAsset } from '@shared/FormInput/InputElement/AssetSelection'
import { getServiceByName } from './ddo'
import normalizeUrl from 'normalize-url'

export async function transformAssetToAssetSelection(
  datasetProviderEndpoint: string,
  assets: Asset[],
  selectedAlgorithms?: PublisherTrustedAlgorithm[]
): Promise<AssetSelectionAsset[]> {
  const algorithmList: AssetSelectionAsset[] = []

  for (const asset of assets) {
    const algoService = getServiceByName(asset, 'access')

    if (
      Number(asset?.indexedMetadata?.stats[0]?.prices[0]?.price) >= 0 &&
      normalizeUrl(algoService?.serviceEndpoint) ===
        normalizeUrl(datasetProviderEndpoint)
    ) {
      let selected = false
      selectedAlgorithms?.forEach((algorithm: PublisherTrustedAlgorithm) => {
        if (algorithm.did === asset.id) {
          selected = true
        }
      })
      const algorithmAsset: AssetSelectionAsset = {
        did: asset.id,
        name: asset.metadata.name,
        price: Number(asset.indexedMetadata?.stats[0]?.prices[0]?.price),
        checked: selected,
        symbol: asset.indexedMetadata.stats[0].symbol
      }
      selected
        ? algorithmList.unshift(algorithmAsset)
        : algorithmList.push(algorithmAsset)
    }
  }
  return algorithmList
}
