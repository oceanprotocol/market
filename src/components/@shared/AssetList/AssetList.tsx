import AssetTeaser from '@shared/AssetTeaser/AssetTeaser'
import React, { useEffect, useState } from 'react'
import Pagination from '@shared/Pagination'
import styles from './AssetList.module.css'
import { DDO } from '@oceanprotocol/lib'
import classNames from 'classnames/bind'
import { getAssetsBestPrices, AssetListPrices } from '@utils/subgraph'
import Loader from '@shared/atoms/Loader'
import { useUserPreferences } from '@context/UserPreferences'
import { useIsMounted } from '@hooks/useIsMounted'

const cx = classNames.bind(styles)

function LoaderArea() {
  return (
    <div className={styles.loaderWrap}>
      <Loader />
    </div>
  )
}

declare type AssetListProps = {
  assets: DDO[]
  showPagination: boolean
  page?: number
  totalPages?: number
  isLoading?: boolean
  onPageChange?: React.Dispatch<React.SetStateAction<number>>
  className?: string
  noPublisher?: boolean
}

const AssetList: React.FC<AssetListProps> = ({
  assets,
  showPagination,
  page,
  totalPages,
  isLoading,
  onPageChange,
  className,
  noPublisher
}) => {
  const { chainIds } = useUserPreferences()
  const [assetsWithPrices, setAssetsWithPrices] = useState<AssetListPrices[]>()
  const [loading, setLoading] = useState<boolean>(isLoading)
  const isMounted = useIsMounted()

  useEffect(() => {
    if (!assets) return

    const initialAssets: AssetListPrices[] = assets.map((asset) => ({
      ddo: asset,
      price: null
    }))
    setAssetsWithPrices(initialAssets)
    setLoading(false)

    async function fetchPrices() {
      const assetsWithPrices = await getAssetsBestPrices(assets)
      if (!isMounted()) return
      setAssetsWithPrices(assetsWithPrices)
    }
    fetchPrices()
  }, [assets, isMounted])

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
          assetsWithPrices.map((assetWithPrice) => (
            <AssetTeaser
              ddo={assetWithPrice.ddo}
              price={assetWithPrice.price}
              key={assetWithPrice.ddo.id}
              noPublisher={noPublisher}
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

export default AssetList
