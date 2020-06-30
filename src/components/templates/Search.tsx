import React from 'react'
import { QueryResult } from '@oceanprotocol/squid/dist/node/aquarius/Aquarius'
import Layout from '../../components/Layout'
import PageHeader from '../molecules/PageHeader'
import SearchBar from '../molecules/SearchBar'
import AssetList from '../organisms/AssetList'
import { SearchPriceFilter } from '../molecules/SearchPriceFilter'

import styles from './Search.module.css'

export declare type SearchPageProps = {
  text: string | string[]

  tag: string | string[]
  queryResult: QueryResult
}

const SearchPage = ({ text, tag, queryResult }: SearchPageProps) => {
  return (
    <Layout noPageHeader>
      <section className={styles.grid}>
        <div className={styles.search}>
          <PageHeader title={`Search for ${text || tag}`} />
          {text && <SearchBar initialValue={text as string} />}
        </div>

        <aside className={styles.side}>
          <SearchPriceFilter />
        </aside>

        <div className={styles.results}>
          {queryResult.results.length > 0 ? (
            <AssetList queryResult={queryResult} />
          ) : (
            <div className={styles.empty}>No results found.</div>
          )}
        </div>
      </section>
    </Layout>
  )
}

export default SearchPage
