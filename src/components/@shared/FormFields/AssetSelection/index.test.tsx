import React from 'react'
import { act, render } from '@testing-library/react'
import { assetSelectionAsset } from '../../../../../.storybook/__mockdata__/index'
import UrqlClientProvider from '../../../../@context/UrqlProvider'
import AssetSelection from './'
import MarketMetadataProvider from '@context/MarketMetadata'

test('render Asset Selection List', async () => {
  const args = {
    assets: assetSelectionAsset,
    multiple: true,
    disabled: false
  }
  // TODO: remove eslint rule (testing-library/no-unnecessary-act) and solve act issue
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    render(
      <MarketMetadataProvider>
        <UrqlClientProvider>
          <AssetSelection {...args} />
        </UrqlClientProvider>
      </MarketMetadataProvider>
    )
  })
})
