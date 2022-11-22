import React, { ReactElement, useEffect, useState } from 'react'
import Pagination from '@shared/Pagination'
import styles from './index.module.css'
import Loader from '@shared/atoms/Loader'
import { useIsMounted } from '@hooks/useIsMounted'
import { getAccessDetailsForAssets } from '@utils/accessDetailsAndPricing'
import { useWeb3 } from '@context/Web3'
import { AssetSignalItem } from '@context/Signals/_types'
import useSignalsLoader, { useListSignals } from '@hooks/useSignals'
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
  const [dataTokenAddresses, setDataTokenAddresses] = useState<string[][]>(
    assetsWithPrices?.map((asset) =>
      asset.datatokens.map((data) => data.address)
    ) || []
  )
  const isMounted = useIsMounted()
  // Signals loading logic
  // Get from AssetList component
  const { signals, assetSignalsUrls } = useSignalContext()
  const { urls } = useListSignals(
    dataTokenAddresses,
    signals,
    assetSignalsUrls,
    'listView',
    true
  )
  const { signalItems, loading: isFetchingSignals } = useSignalsLoader(urls)
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

  useEffect(() => {
    if (assetsWithPrices) {
      setDataTokenAddresses(
        assetsWithPrices.map((asset) =>
          asset.datatokens.map((data) => data.address)
        )
      )
    }
  }, [assetsWithPrices])

  // // This changes the page field inside the query
  function handlePageChange(selected: number) {
    onPageChange(selected + 1)
  }
  const styleClasses = `${styles.assetList} ${className || ''}`

  return loading || isFetchingSignals ? (
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
