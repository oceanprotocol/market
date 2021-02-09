import AssetTeaser from '../molecules/AssetTeaser'
import React from 'react'
import Pagination from '../molecules/Pagination'
import styles from './AssetList.module.css'
import { DDO } from '@oceanprotocol/lib'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

declare type AssetListProps = {
  assets: DDO[]
  showPagination: boolean
  page?: number
  totalPages?: number
  onPageChange?: React.Dispatch<React.SetStateAction<number>>
  className?: string
}

const AssetList: React.FC<AssetListProps> = ({
  assets,
  showPagination,
  page,
  totalPages,
  onPageChange,
  className
}) => {
  // // This changes the page field inside the query
  function handlePageChange(selected: number) {
    onPageChange(selected + 1)
  }

  const styleClasses = cx({
    assetList: true,
    [className]: className
  })

  return (
    <>
      <div className={styleClasses}>
        {/* 
          HEADS UP! The `!(assets[0] as any).last_block` check 
          is a failsafe so AssetList does not break app when 
          some Aquarius query returns something unexpected for 
          what should be empty results.
        */}
        {assets.length > 0 && !(assets[0] as any).last_block ? (
          assets.map((ddo) => <AssetTeaser ddo={ddo} key={ddo.id} />)
        ) : (
          <div className={styles.empty}>No results found.</div>
        )}
      </div>

      {showPagination && (
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      )}
    </>
  )
}

export default AssetList
