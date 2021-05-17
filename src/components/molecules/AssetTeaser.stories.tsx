import AssetTeaser from '../molecules/AssetTeaser'
import * as React from 'react'
import { DDO } from '@oceanprotocol/lib'
import ddo from '../../../tests/unit/__fixtures__/ddo'
import { AssetListPrices } from '../../utils/subgraph'

export default {
  title: 'Molecules/Asset Teaser'
}

export const Default = () => <AssetTeaser ddo={ddo as DDO} price={undefined} />
