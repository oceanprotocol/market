import React, { useEffect, useState } from 'react'
import { getAssetsBestPrices, AssetListPrices } from '../../utils/subgraph'
import Loader from '../atoms/Loader'
import Pagination from '../molecules/Pagination'
import AssetTeaser from '../molecules/AssetTeaser'
import { DDO } from '@oceanprotocol/lib'
import { assetList, loaderWrap, empty } from './AssetList.module.css'

function LoaderArea() {
  return (
    <div className={loaderWrap}>
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

  return assetsWithPrices &&
    !loading &&
    (isLoading === undefined || isLoading === false) ? (
    <>
      <div className={`${assetList} ${className}`}>
        {assetsWithPrices.length > 0 ? (
          assetsWithPrices.map((assetWithPrice) => (
            <AssetTeaser
              ddo={assetWithPrice.ddo}
              price={assetWithPrice.price}
              key={assetWithPrice.ddo.id}
            />
          ))
        ) : (
          <div className={empty}>No results found.</div>
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
