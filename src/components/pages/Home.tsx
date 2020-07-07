import React, { ReactElement } from 'react'
import SearchBar from '../molecules/SearchBar'
import { DID } from '@oceanprotocol/squid'
import { Link } from 'gatsby'
import shortid from 'shortid'
import { OceanAsset } from '../../@types/MetaData'

export default function HomePage({
  assets
}: {
  assets: {
    node: OceanAsset
  }[]
}): ReactElement {
  return (
    <>
      <SearchBar large />
      {assets && (
        <ul>
          {assets.map(({ node }: { node: { did: DID } }) => (
            <li key={shortid.generate()}>
              <Link to={`/asset/${node.did}`}>{node.did}</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
