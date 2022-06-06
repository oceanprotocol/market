import AssetTeaser from '@shared/AssetTeaser'
import React, { ReactElement, useEffect, useState } from 'react'
import Pagination from '@shared/Pagination'
import styles from './index.module.css'
import classNames from 'classnames/bind'
import Loader from '@shared/atoms/Loader'
import { useIsMounted } from '@hooks/useIsMounted'
// not sure why this import is required
import { AssetExtended } from 'src/@types/AssetExtended'
import { Asset } from '@oceanprotocol/lib'
import { getAccessDetailsForAssets } from '@utils/accessDetailsAndPricing'
import { Prices } from '@context/Prices'

const cx = classNames.bind(styles)

function LoaderArea() {
  return (
    <div className={styles.loaderWrap}>
      <Loader />
    </div>
  )
}

export interface AssetListProps {
  assets: Asset[]
  showPagination: boolean
  page?: number
  totalPages?: number
  isLoading?: boolean
  onPageChange?: React.Dispatch<React.SetStateAction<number>>
  className?: string
  noPublisher?: boolean
  chainIds: number[]
  accountId: string
  locale: string
  currency: string
  prices: Prices
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
  chainIds,
  accountId,
  locale,
  currency,
  prices
}: AssetListProps): ReactElement {
  const [assetsWithPrices, setAssetsWithPrices] = useState<AssetExtended[]>()
  const [loading, setLoading] = useState<boolean>(isLoading)
  const isMounted = useIsMounted()

  useEffect(() => {
    if (!assets) return
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

  // // This changes the page field inside the query
  function handlePageChange(selected: number) {
    onPageChange(selected + 1)
  }

  const styleClasses = cx({
    assetList: true,
    [className]: className
  })

  return chainIds.length === 0 ? (
    <div className={styleClasses}>
      <div className={styles.empty}>No network selected</div>
    </div>
  ) : assetsWithPrices && !loading ? (
    <>
      <div className={styleClasses}>
        {assetsWithPrices.length > 0 ? (
          assetsWithPrices.map((assetWithPrice, i) => (
            <AssetTeaser
              asset={assetWithPrice}
              key={`${assetWithPrice.id}_${i}`}
              noPublisher={noPublisher}
              locale={locale}
              currency={currency}
              prices={prices}
            />
          ))
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
  ) : (
    <LoaderArea />
  )
}
