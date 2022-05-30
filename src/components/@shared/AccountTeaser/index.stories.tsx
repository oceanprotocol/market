import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import AccountTeaser, { AccountTeaserProps } from '@shared/AccountTeaser'

export default {
  title: 'Component/@shared/AccountTeaser',
  component: AccountTeaser
} as ComponentMeta<typeof AccountTeaser>

const Template: ComponentStory<typeof AccountTeaser> = (
  args: AccountTeaserProps
) => <AccountTeaser {...args} />

interface Props {
  args: AccountTeaserProps
}

export const Default: Props = Template.bind({})
Default.args = {
  accountTeaserVM: {
    address: '0x00000000000000000000000000000000000000000',
    nrSales: 25
  },
  place: 1
}
