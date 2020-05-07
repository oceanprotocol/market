import React from 'react'
import Layout from '../../Layout'
import AssetList from '../organisms/AssetList'
import { QueryResult } from '@oceanprotocol/squid/dist/node/aquarius/Aquarius'

export declare type ExplorePageProps = {
  queryResult: QueryResult
}
const title = 'Explore Data'

const ExplorePage: React.FC<ExplorePageProps> = ({
  queryResult
}: ExplorePageProps) => (
  <Layout title={title} description="Find the data sets you are looking for.">
    <AssetList queryResult={queryResult} />
  </Layout>
)

export default ExplorePage
