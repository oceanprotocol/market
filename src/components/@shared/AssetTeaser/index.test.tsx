import React from 'react'
import testRender from '../../../../.jest/testRender'
import AssetTeaser from './index'
import { Default } from './index.stories'

describe('AssetTeaser', () => {
  testRender(<AssetTeaser {...Default.args} />)
})
