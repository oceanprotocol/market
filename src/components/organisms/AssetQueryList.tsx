import AssetTeaser from '../molecules/AssetTeaser'
import React from 'react'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import Pagination from '../molecules/Pagination'
import styles from './AssetQueryList.module.css'
import { DDO } from '@oceanprotocol/lib'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

declare type AssetQueryListProps = {
  queryResult: QueryResult
  setPage?: React.Dispatch<React.SetStateAction<number>>
  className?: string
}

const AssetQueryList: React.FC<AssetQueryListProps> = ({
  queryResult,
  setPage,
  className
}) => {
  // // This changes the page field inside the query
  function onPageChange(selected: number) {
    setPage(selected + 1)
  }

  const styleClasses = cx({
    assetList: true,
    [className]: className
  })

  return (
    <>
      <div className={styleClasses}>
        {queryResult?.results.length > 0 ? (
          queryResult.results.map((ddo: DDO) => (
            <AssetTeaser ddo={ddo} key={ddo.id} />
          ))
        ) : (
          <div className={styles.empty}>No results found.</div>
        )}
      </div>

      {setPage && queryResult && (
        <Pagination
          totalPages={queryResult.totalPages}
          currentPage={queryResult.page}
          onPageChange={onPageChange}
        />
      )}
    </>
  )
}

export default AssetQueryList
