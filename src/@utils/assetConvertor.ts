import { PublisherTrustedAlgorithm, Asset } from '@oceanprotocol/lib'
import { AssetSelectionAsset } from '@shared/FormInput/InputElement/AssetSelection'
import { getServiceByName } from './ddo'

export async function transformAssetToAssetSelection(
  datasetProviderEndpoint: string,
  assets: Asset[],
  selectedAlgorithms?: PublisherTrustedAlgorithm[]
): Promise<AssetSelectionAsset[]> {
  const algorithmList: AssetSelectionAsset[] = []

  for (const asset of assets) {
    const algoService =
      getServiceByName(asset, 'compute') || getServiceByName(asset, 'access')

    if (
      asset?.stats?.price?.value &&
      algoService?.serviceEndpoint === datasetProviderEndpoint
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
        price: asset.stats.price.value,
        checked: selected,
        symbol: asset.datatokens[0].symbol
      }
      selected
        ? algorithmList.unshift(algorithmAsset)
        : algorithmList.push(algorithmAsset)
    }
  }
  return algorithmList
}
