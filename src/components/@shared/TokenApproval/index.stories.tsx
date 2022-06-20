import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import TokenApproval, { TokenApprovalProps } from '@shared/TokenApproval'
import { UserPreferencesProvider } from '@context/UserPreferences'
import { MarketMetadataProvider } from '@context/MarketMetadata'

export default {
  title: 'Component/@shared/TokenApproval',
  component: TokenApproval
} as ComponentMeta<typeof TokenApproval>

const Template: ComponentStory<typeof TokenApproval> = (
  args: TokenApprovalProps
) => {
  return (
    <MarketMetadataProvider>
      <UserPreferencesProvider>
        <TokenApproval {...args} />
      </UserPreferencesProvider>
    </MarketMetadataProvider>
  )
}

interface Props {
  args: TokenApprovalProps
}

export const Default: Props = Template.bind({})
Default.args = {
  actionButton: <p>test</p>,
  disabled: false,
  amount: '1',
  tokenAddress: '0x0000000000000000000000000000000000000000',
  tokenSymbol: 'ETH',
  setIsTokenApproved: () => {
    console.log('clicked')
  }
}
