import AssetTeaser from '../molecules/AssetTeaser'
import React, { useEffect, useState } from 'react'
import Pagination from '../molecules/Pagination'
import styles from './AssetList.module.css'
import { DDO } from '@oceanprotocol/lib'
import classNames from 'classnames/bind'
import { getAssetsBestPrices, AssetListPrices } from '../../utils/subgraph'
import Loader from '../atoms/Loader'
import { useUserPreferences } from '../../providers/UserPreferences'

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
  const [assetsWithPrices, setAssetWithPrices] = useState<AssetListPrices[]>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!assets) return
    isLoading && setLoading(true)
    getAssetsBestPrices(assets).then((asset) => {
      setAssetWithPrices(asset)
      setLoading(false)
    })
  }, [assets])

  // // This changes the page field inside the query
  function handlePageChange(selected: number) {
    onPageChange(selected + 1)
  }

  const styleClasses = cx({
    assetList: true,
    [className]: className
  })

  return assetsWithPrices &&
    !loading &&
    (isLoading === undefined || isLoading === false) ? (
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
        ) : chainIds.length === 0 ? (
          <div className={styles.empty}>No network selected.</div>
        ) : (
          <div className={styles.empty}>No results found.</div>
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
