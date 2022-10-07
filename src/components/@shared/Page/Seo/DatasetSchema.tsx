import { useAsset } from '@context/Asset'
import { useMarketMetadata } from '@context/MarketMetadata'
import useNetworkMetadata, {
  filterNetworksByType
} from '@hooks/useNetworkMetadata'
import removeMarkdown from 'remove-markdown'

const DatasetSchema = (): object => {
  const { asset, isInPurgatory } = useAsset()
  const { networksList } = useNetworkMetadata()
  const { appConfig } = useMarketMetadata()

  const networksMain = filterNetworksByType(
    'mainnet',
    appConfig.chainIdsSupported,
    networksList
  )

  // only show schema on main nets
  const isMainNetwork = networksMain.includes(asset?.chainId)

  const isDataset = asset?.metadata?.type === 'dataset'

  if (!asset || !isMainNetwork || !isDataset || isInPurgatory) return null

  let isDownloadable = false
  if (asset?.services && Array.isArray(asset?.services)) {
    for (const service of asset.services) {
      if (service?.type === 'access') {
        isDownloadable = true
        break
      }
    }
  }

  // https://developers.google.com/search/docs/advanced/structured-data/dataset
  const datasetSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Dataset',
    name: asset?.metadata?.name,
    description: removeMarkdown(
      asset?.metadata?.description?.substring(0, 5000) || ''
    ),
    keywords: asset?.metadata?.tags,
    datePublished: asset?.metadata?.created,
    dateModified: asset?.metadata?.updated,
    license: asset?.metadata?.license,
    ...(asset?.accessDetails?.type === 'free'
      ? { isAccessibleForFree: true }
      : {
          isAccessibleForFree: false,
          paymentAccepted: 'Cryptocurrency',
          currenciesAccepted: asset?.accessDetails?.baseToken?.symbol,
          offers: {
            '@type': 'Offer',
            price: asset?.accessDetails?.price,
            priceCurrency: asset?.accessDetails?.baseToken?.symbol
          }
        }),
    creator: {
      '@type': 'Organization',
      name: asset?.metadata?.author
    },
    ...(isDownloadable && {
      distribution: [
        {
          '@type': 'DataDownload',
          encodingFormat: ''
        }
      ]
    })
  }

  return datasetSchema
}

export { DatasetSchema }
