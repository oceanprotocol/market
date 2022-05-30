import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import AccountList, { AccountListProps } from '@shared/AccountList'
import * as config from '../../../../app.config'

export default {
  title: 'Component/@shared/AccountList',
  component: AccountList
} as ComponentMeta<typeof AccountList>

const Template: ComponentStory<typeof AccountList> = (
  args: AccountListProps
) => <AccountList {...args} />

interface Props {
  args: AccountListProps
}

export const Default: Props = Template.bind({})
Default.args = {
  accounts: [
    {
      address: '0x00000000000000000000000000000000000000000',
      nrSales: 25
    },
    {
      address: '0x00000000000000000000000000000000000000000',
      nrSales: 11
    },
    {
      address: '0x00000000000000000000000000000000000000000',
      nrSales: 5
    }
  ],
  isLoading: false,
  chainIds: config.chainIds
}
