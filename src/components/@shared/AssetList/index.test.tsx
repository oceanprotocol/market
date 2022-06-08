import React from 'react'
import { act, render } from '@testing-library/react'
import {
  assets,
  locale,
  mockWallet,
  prices
} from '../../../../.storybook/__mockdata__'
import * as config from '../../../../app.config'
import AssetList from './'
import UrqlClientProvider from '@context/UrqlProvider'

test('render AssetList with arc', async () => {
  const args = {
    locale,
    assets,
    showPagination: false,
    chainIds: config.chainIds,
    accountId: mockWallet,
    currency: 'OCEAN',
    prices
  }
  // TODO: remove eslint rule (testing-library/no-unnecessary-act) and solve act issue
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    render(
      <UrqlClientProvider>
        <AssetList {...args} />
      </UrqlClientProvider>
    )
  })
})
