import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Token, { TokenProps } from '@shared/Token'
import { locale, currency, prices } from '../../../../.storybook/__mockdata__'
import { PricesProvider } from '@context/Prices'
import { UserPreferencesProvider } from '@context/UserPreferences'
import { MarketMetadataProvider } from '@context/MarketMetadata'

export default {
  title: 'Component/@shared/Token',
  component: Token
} as ComponentMeta<typeof Token>

const Template: ComponentStory<typeof Token> = (args: TokenProps) => {
  return (
    <MarketMetadataProvider>
      <UserPreferencesProvider>
        <PricesProvider>
          <Token {...args} />
        </PricesProvider>
      </UserPreferencesProvider>
    </MarketMetadataProvider>
  )
}

interface Props {
  args: TokenProps
}

export const Default: Props = Template.bind({})
Default.args = {
  symbol: 'ETH',
  balance: '1'
}
