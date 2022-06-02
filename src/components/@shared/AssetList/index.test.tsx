import React from 'react'
import { act, render } from '@testing-library/react'
import { assets, locale } from '../../../../.storybook/__mockdata__'
import * as config from '../../../../app.config'
import AssetList from './'
import UrqlClientProvider from '@context/UrqlProvider'

test('render AssetList with arc', async () => {
  const args = {
    locale,
    assets,
    showPagination: false,
    chainIds: config.chainIds,
    accountId: '0x491AECC4b3d690a4D7027A385499fd04fE50b796'
  }
  await act(async () => {
    render(
      <UrqlClientProvider>
        <AssetList {...args} />
      </UrqlClientProvider>
    )
  })
})
