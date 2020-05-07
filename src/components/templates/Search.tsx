import React from 'react'
import { QueryResult } from '@oceanprotocol/squid/dist/node/aquarius/Aquarius'
import Layout from '../../Layout'
import PageHeader from '../molecules/PageHeader'
import SearchBar from '../molecules/SearchBar'
import AssetList from '../organisms/AssetList'
import SearchCategoriesFilter from '../molecules/SearchCategoriesFilter'
import { SearchPriceFilter } from '../molecules/SearchPriceFilter'

import styles from './Search.module.css'

export declare type SearchPageProps = {
  text: string | string[]
  categories: string[] | undefined
  tag: string | string[]
  queryResult: QueryResult
}

const SearchPage = ({
  text,
  categories,
  tag,
  queryResult
}: SearchPageProps) => {
  const categoriesText = categories?.join(', ')
  return (
    <Layout noPageHeader>
      <section className={styles.grid}>
        <div className={styles.search}>
          <PageHeader title={`Search for ${text || categoriesText || tag}`} />
          {text && <SearchBar initialValue={text as string} />}
        </div>

        <aside className={styles.side}>
          <SearchCategoriesFilter />
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
