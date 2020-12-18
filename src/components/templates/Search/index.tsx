import React, { ReactElement, useState, useEffect } from 'react'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import SearchBar from '../../molecules/SearchBar'
import AssetQueryList from '../../organisms/AssetQueryList'
import styles from './index.module.css'
import PriceFilter from './filterPrice'
import Sort, { initItems } from './sort'
import queryString from 'query-string'
import { getResults, SortItem, makeQueryString } from './utils'
import Loader from '../../atoms/Loader'
import { useOcean } from '@oceanprotocol/react'
import { useNavigate } from '@reach/router'

export default function SearchPage({
  location
}: {
  location: Location
}): ReactElement {
  const { config } = useOcean()
  const parsed = queryString.parse(location.search)
  const { text, owner, tags, page, sort, price } = parsed
  const [queryResult, setQueryResult] = useState<QueryResult>()
  const [loading, setLoading] = useState<boolean>(true)
  const [priceType, setPriceType] = useState<string>(price as string)
  const [text2, setText] = useState<string>(text as string)
  const [page2, setPage] = useState<string>(page as string)

  const [items, setItems] = useState<SortItem[]>(initItems(sort as string[]))
  const navigate = useNavigate()
  useEffect(() => {
    setPage('1')
  }, [text, text2, owner, tags, priceType, items]) // reset to first page if any other parameter changed
  useEffect(() => {
    setPage(page as string)
  }, [page])
  useEffect(() => {
    if (!config?.metadataCacheUri) return

    async function initSearch() {
      setLoading(true)
      await navigate(
        `/search?` +
          makeQueryString({
            text: text2,
            owner,
            tags,
            page: page2,
            priceType,
            items
          })
      )
      const queryResult = await getResults(
        { ...parsed, sort: items, priceType, text: text2, page: page2 },
        config.metadataCacheUri
      )
      setQueryResult(queryResult)
      console.log(queryResult)
      setLoading(false)
    }
    initSearch()
  }, [
    config.metadataCacheUri,
    text,
    text2,
    owner,
    tags,
    page,
    page2,
    priceType,
    items
  ])

  return (
    <section className={styles.grid}>
      <div className={styles.search}>
        {(text2 || owner || true) && (
          <SearchBar
            initialValue={(text2 || owner) as string}
            setText={setText}
          />
        )}
        <div className={styles.row}>
          <PriceFilter priceType={priceType} setPriceType={setPriceType} />
          <Sort items={items} setItems={setItems} />
        </div>
      </div>

      <div className={styles.results}>
        {loading ? <Loader /> : <AssetQueryList queryResult={queryResult} />}
      </div>
    </section>
  )
}
