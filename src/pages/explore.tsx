import React from 'react'
import { NextPage, GetServerSideProps } from 'next'
import { Aquarius, Logger } from '@oceanprotocol/squid'
import { SearchQuery } from '@oceanprotocol/squid/dist/node/aquarius/Aquarius'
import ExplorePage from '../components/pages/Explore'
import { config } from '../config/ocean'

const Explore: NextPage<{ queryResult: string }> = ({ queryResult }) => (
  <ExplorePage queryResult={JSON.parse(queryResult)} />
)

export const getServerSideProps: GetServerSideProps = async context => {
  const searchQuery = {
    offset: 15,
    page: Number(context.query.page) || 1,
    query: {},
    sort: {
      created: -1
    }
  } as SearchQuery
  console.log(config)
  const aquarius = new Aquarius(config.aquariusUri as string, Logger)
  const queryResult = await aquarius.queryMetadata(searchQuery)
  // Note: stringifying the results cause Next.js otherwise complains about
  // not being able to serialize the results array for whatever reason.
  // So manually serialize them here, and parse them back in the above page.
  return { props: { queryResult: JSON.stringify(queryResult) } }
}

export default Explore
