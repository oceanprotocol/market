import AssetTeaser from '@shared/AssetTeaser'
import React, { ReactElement, useEffect, useState } from 'react'
import Pagination from '@shared/Pagination'
import styles from './index.module.css'
import Loader from '@shared/atoms/Loader'
import { useIsMounted } from '@hooks/useIsMounted'
import { useWeb3 } from '@context/Web3'
import { useCancelToken } from '@hooks/useCancelToken'

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
}

export default function AssetList({
  assets,
  showPagination,
  page,
  totalPages,
  onPageChange,
  className,
  noPublisher,
  noDescription,
  noPrice
}: AssetListProps): ReactElement {
  // This changes the page field inside the query
  function handlePageChange(selected: number) {
    onPageChange(selected + 1)
  }

  const styleClasses = `${styles.assetList} ${className || ''}`

  return (
    <>
      <div className={styleClasses}>
        {assets?.length > 0 ? (
          assets?.map((asset) => (
            <AssetTeaser
              asset={asset}
              key={asset.id}
              noPublisher={noPublisher}
              noDescription={noDescription}
              noPrice={noPrice}
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
  )
}
