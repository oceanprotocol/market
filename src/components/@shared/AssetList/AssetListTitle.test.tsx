import React from 'react'
import testRender from '../../../../.jest/testRender'
import AssetListTitle from './AssetListTitle'

describe('AssetListTitle', () => {
  testRender(
    <AssetListTitle asset={{ metadata: { name: 'Hello world' } } as any} />
  )
})
