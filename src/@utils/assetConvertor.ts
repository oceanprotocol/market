import { getAccessDetailsForAssets } from './accessDetailsAndPricing'
import { AssetExtended } from 'src/@types/AssetExtended'
import { PublisherTrustedAlgorithm, Asset } from '@oceanprotocol/lib'
import { AssetSelectionAsset } from '@shared/FormFields/AssetSelection'
import { getServiceByName } from './ddo'

export async function transformAssetToAssetSelection(
  datasetProviderEndpoint: string,
  assets: Asset[],
  selectedAlgorithms?: PublisherTrustedAlgorithm[]
): Promise<AssetSelectionAsset[]> {
  const extendedAssets: AssetExtended[] = await getAccessDetailsForAssets(
    assets
  )
  const algorithmList: AssetSelectionAsset[] = []

  for (const asset of extendedAssets) {
    const algoComputeService = getServiceByName(asset, 'compute')

    if (
      asset?.accessDetails?.price &&
      algoComputeService?.serviceEndpoint === datasetProviderEndpoint
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
        price: asset.accessDetails.price,
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
