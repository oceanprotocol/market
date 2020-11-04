import AssetTeaser from '../molecules/AssetTeaser'
import React from 'react'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import { useLocation, useNavigate } from '@reach/router'
import Pagination from '../molecules/Pagination'
import { updateQueryStringParameter } from '../../utils'
import styles from './AssetQueryList.module.css'
import { DDO } from '@oceanprotocol/lib'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

declare type AssetQueryListProps = {
  queryResult: QueryResult
  className?: string
}

const AssetQueryList: React.FC<AssetQueryListProps> = ({
  queryResult,
  className
}) => {
  const location = useLocation()
  const navigate = useNavigate()

  // Construct the urls on the pagination links. This is only for UX,
  // since the links are no <Link> they will not work by itself.
  function hrefBuilder(pageIndex: number) {
    const newUrl = updateQueryStringParameter(
      location.pathname + location.search,
      'page',
      `${pageIndex}`
    )
    return newUrl
  }

  // // This is what iniitates a new search with new `page`
  // // url parameter
  function onPageChange(selected: number) {
    const newUrl = updateQueryStringParameter(
      location.pathname + location.search,
      'page',
      `${selected + 1}`
    )
    return navigate(newUrl)
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

      {/* 
        Little hack cause the pagination navigation only works 
        on the search page right now.
      */}
      {location.pathname === '/search' && queryResult && (
        <Pagination
          totalPages={queryResult.totalPages}
          currentPage={queryResult.page}
          hrefBuilder={hrefBuilder}
          onPageChange={onPageChange}
        />
      )}
    </>
  )
}

export default AssetQueryList
