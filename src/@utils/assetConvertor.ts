import { getAccessDetailsForAssets } from './accessDetailsAndPricing'
import { PublisherTrustedAlgorithm, Asset } from '@oceanprotocol/lib'
import { AssetSelectionAsset } from '@shared/FormInput/InputElement/AssetSelection'

export async function transformAssetToAssetSelection(
  assets: Asset[],
  selectedAlgorithms?: PublisherTrustedAlgorithm[]
): Promise<AssetSelectionAsset[]> {
  console.log(`assets: ${JSON.stringify(assets)}`)
  console.log(`selectedAlgorithms: ${JSON.stringify(selectedAlgorithms)}`)

  const extendedAssets: AssetExtended[] = await getAccessDetailsForAssets(
    assets
  )
  const algorithmList: AssetSelectionAsset[] = []
  console.log(`extendedAssets: ${JSON.stringify(extendedAssets)}`)
  for (const asset of extendedAssets) {
    if (asset?.accessDetails?.price) {
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
        symbol: asset.datatokens[0].symbol,
        chainId: asset.chainId
      }
      selected
        ? algorithmList.unshift(algorithmAsset)
        : algorithmList.push(algorithmAsset)
    }
  }
  return algorithmList
}
