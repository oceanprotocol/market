import AssetTeaser from '../molecules/AssetTeaser'
import React, { useEffect, useState } from 'react'
import Pagination from '../molecules/Pagination'
import styles from './AssetList.module.css'
import { DDO } from '@oceanprotocol/lib'
import classNames from 'classnames/bind'
import { getAssetsPrices, AssetListPrices } from '../../utils/subgraph'
import Loader from '../atoms/Loader'

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
}

const AssetList: React.FC<AssetListProps> = ({
  assets,
  showPagination,
  page,
  totalPages,
  isLoading,
  onPageChange,
  className
}) => {
  const [assetPrices, setAssetPrices] = useState<AssetListPrices[]>()

  useEffect(() => {
    if (!assets) return
    getAssetsPrices(assets).then((prices) => {
      setAssetPrices(prices)
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

  return assetPrices &&
    assets &&
    (isLoading === undefined || isLoading === false) ? (
    <>
      <div className={styleClasses}>
        {assets.length > 0 ? (
          assets.map((ddo) => (
            <AssetTeaser
              ddo={ddo}
              price={
                assetPrices.find(
                  (assetPrice: AssetListPrices) =>
                    assetPrice.datatokenAddress === ddo.dataToken.toLowerCase()
                )?.price
              }
              key={ddo.id}
            />
          ))
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
