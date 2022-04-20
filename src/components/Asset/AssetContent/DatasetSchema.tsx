import React, { ReactElement } from 'react'
import { useAsset } from '@context/Asset'
import { Asset } from '@oceanprotocol/lib'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import useNetworkMetadata, {
  filterNetworksByType
} from '@hooks/useNetworkMetadata'
import removeMarkdown from 'remove-markdown'

export default function DatasetSchema({ ddo }: { ddo: Asset }): ReactElement {
  const { isInPurgatory } = useAsset()

  const { networksList } = useNetworkMetadata()
  const { appConfig } = useSiteMetadata()
  const networksMain = filterNetworksByType(
    'mainnet',
    appConfig.chainIdsSupported,
    networksList
  )

  // only show schema on main nets
  const isMainNetwork = networksMain.includes(ddo?.chainId)

  const isDataset = ddo.metadata?.type === 'dataset'

  let isDownloadable = false
  if (ddo?.services && Array.isArray(ddo?.services)) {
    for (const service of ddo?.services) {
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
    name: ddo?.metadata?.name,
    description: removeMarkdown(
      ddo?.metadata?.description?.substring(0, 5000) || ''
    ),
    keywords: ddo?.metadata?.tags,
    datePublished: ddo?.metadata?.created,
    dateModified: ddo?.metadata?.updated,
    license: ddo?.metadata?.license,
    ...(ddo?.accessDetails?.type === 'free'
      ? { isAccessibleForFree: true }
      : {
          isAccessibleForFree: false,
          paymentAccepted: 'Cryptocurrency',
          currenciesAccepted: ddo?.accessDetails?.baseToken?.symbol,
          offers: {
            '@type': 'Offer',
            price: ddo?.accessDetails?.price,
            priceCurrency: ddo?.accessDetails?.baseToken?.symbol
          }
        }),
    creator: {
      '@type': 'Organization',
      name: ddo?.metadata?.author
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

  return ddo && !isMainNetwork && isDataset && !isInPurgatory ? (
    <script type="application/ld+json" id="DatasetSchema">
      {JSON.stringify(datasetSchema).replace(/</g, '\\u003c')}
    </script>
  ) : null
}
