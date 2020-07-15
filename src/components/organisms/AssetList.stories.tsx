import React from 'react'
import { DDO } from '@oceanprotocol/lib'
import AssetList from './AssetList'
import asset from '../../../tests/unit/__fixtures__/ddo'

const queryResult = {
  results: [asset, asset, asset, asset, asset, asset].map(
    (asset) => new DDO(asset)
  ),
  page: 1,
  totalPages: 100,
  totalResults: 1000
}

export default {
  title: 'Organisms/Asset List'
}

export const Default = () => <AssetList queryResult={queryResult} />
