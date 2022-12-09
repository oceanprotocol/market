import React, { ReactElement, useEffect, useState } from 'react'
import Pagination from '@shared/Pagination'
import styles from './index.module.css'
import Loader from '@shared/atoms/Loader'
import { useIsMounted } from '@hooks/useIsMounted'
import { getAccessDetailsForAssets } from '@utils/accessDetailsAndPricing'
import { useWeb3 } from '@context/Web3'
import { AssetSignalItem } from '@context/Signals/_types'
import { useSignalContext } from '@context/Signals'
import SignalAssetTeaser from '@shared/SignalAssetTeaser/SignalAssetTeaser'

function LoaderArea() {
  return (
    <div className={styles.loaderWrap}>
      <Loader />
    </div>
  )
}

export declare type AssetListProps = {
  assets: AssetExtended[]
  showPagination: boolean
  page?: number
  totalPages?: number
  isLoading?: boolean
  onPageChange?: React.Dispatch<React.SetStateAction<number>>
  className?: string
  noPublisher?: boolean
  noDescription?: boolean
  noPrice?: boolean
  signalItems?: AssetSignalItem[]
}

export default function AssetList({
  assets,
  showPagination,
  page,
  totalPages,
  isLoading,
  onPageChange,
  className,
  noPublisher,
  noDescription,
  noPrice
}: AssetListProps): ReactElement {
  const { accountId } = useWeb3()
  const [assetsWithPrices, setAssetsWithPrices] =
    useState<AssetExtended[]>(assets)
  const [loading, setLoading] = useState<boolean>(isLoading)
  // Get the token addresses from the assets list
  const [dataTokenAddresses, setDataTokenAddresses] = useState<string[][]>(
    assetsWithPrices?.map((asset) =>
      asset.datatokens.map((data) => data.address)
    ) || []
  )
  const isMounted = useIsMounted()
  // Get the signals from the settings via the SignalContext
  const {
    signals,
    assetSignalsUrls,
    updateDatatokenAddresses,
    datatokenAddresses,
    signalItems,
    loading: isFetchingSignals
  } = useSignalContext()
  // Use the signals from user settings to load the Urls to be fetched by signal loader
  // const { urls } = useListSignals(
  //   datatokenAddresses,
  //   signals,
  //   assetSignalsUrls,
  //   'listView',
  //   true
  // )

  // Fetch the signals from various APIs
  // const { signalItems, loading: isFetchingSignals } = useSignalsLoader(urls)
  useEffect(() => {
    if (!assets || !assets.length) return
    setAssetsWithPrices(assets as AssetExtended[])
    setLoading(false)

    async function fetchPrices() {
      const assetsWithPrices = await getAccessDetailsForAssets(
        assets,
        accountId || ''
      )
      if (!isMounted() || !assetsWithPrices) return
      setAssetsWithPrices([...assetsWithPrices])
    }

    fetchPrices()
  }, [assets, isMounted, accountId])

  // Update the datatoken addresses used to load signals
  useEffect(() => {
    // if we have an asset list update the data token addresses based on this list
    if (assetsWithPrices) {
      updateDatatokenAddresses(
        assetsWithPrices
          .map((asset) =>
            asset.datatokens.map((data) => data.address.toLowerCase())
          )
          .flat()
      )
    }
  }, [assetsWithPrices])
  // // This changes the page field inside the query
  function handlePageChange(selected: number) {
    onPageChange(selected + 1)
  }
  const styleClasses = `${styles.assetList} ${className || ''}`

  return loading ? (
    <LoaderArea />
  ) : (
    <>
      <div className={styleClasses}>
        {assetsWithPrices?.length > 0 ? (
          assetsWithPrices.map((assetWithPrice) => {
            return (
              <SignalAssetTeaser
                asset={assetWithPrice}
                key={assetWithPrice.id}
                noPublisher={noPublisher}
                noDescription={noDescription}
                noPrice={noPrice}
                signalItems={signalItems}
                isLoading={isFetchingSignals}
              />
            )
          })
        ) : (
          <div className={styles.empty}>No results found</div>
        )}
      </div>

      {showPagination && (
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          onChangePage={handlePageChange}
        />
      )}
    </>
  )
}
