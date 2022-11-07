import React from 'react'
import testRender from '../../../../.jest/testRender'
import AssetListTitle from '.'
import { render } from '@testing-library/react'

jest.mock('../../../@utils/aquarius', () => ({
  getAssetsNames: () => Promise.resolve('Test')
}))

describe('AssetListTitle', () => {
  testRender(
    <AssetListTitle asset={{ metadata: { name: 'Hello world' } } as any} />
  )

  it('renders with passed title', () => {
    render(<AssetListTitle title="Hello Title" />)
  })

  it('renders with passed DID', () => {
    render(
      <AssetListTitle did="did:op:764b81877039fa2651b919fc91c399799acb837f270e6d17bfb7973fbe6e9408" />
    )
  })
})
