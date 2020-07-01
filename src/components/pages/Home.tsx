import React, { ReactElement, useState, useEffect } from 'react'
import SearchBar from '../molecules/SearchBar'
import { DID } from '@oceanprotocol/squid'
import { Link } from 'gatsby'
import shortid from 'shortid'
import axios from 'axios'
import { config } from '../../config/ocean'

export default function HomePage(): ReactElement {
  const [assets, setAssets] = useState<DID[]>()

  useEffect(() => {
    async function init() {
      const result = await axios(`${config.aquariusUri}/api/v1/aquarius/assets`)
      const assets = result.data.ids
      setAssets(assets)
    }
    init()
  }, [])

  return (
    <>
      <SearchBar large />
      {assets && (
        <ul>
          {assets.map((did: DID) => (
            <li key={shortid.generate()}>
              <Link to={`/asset/${did}`}>{did}</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
