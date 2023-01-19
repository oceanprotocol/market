import React from 'react'
import testRender from '../../../../.jest/testRender'
import AssetTeaser from './index'
import { asset } from '../../../../.jest/__fixtures__/datasetWithAccessDetails'

describe('@shared/AssetTeaser', () => {
  testRender(<AssetTeaser asset={asset} />)
})
