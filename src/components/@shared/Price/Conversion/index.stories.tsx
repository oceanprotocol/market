import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Conversion, { ConversionProps } from '@shared/Price/Conversion'
import PricesProvider from '@context/Prices'
import MarketMetadataProvider from '@context/MarketMetadata'
import { UserPreferencesProvider } from '@context/UserPreferences'

export default {
  title: 'Component/@shared/Price/Conversion',
  component: Conversion
} as ComponentMeta<typeof Conversion>

const Template: ComponentStory<typeof Conversion> = (args: ConversionProps) => {
  return (
    <MarketMetadataProvider>
      <UserPreferencesProvider>
        <PricesProvider>
          <Conversion {...args} />
        </PricesProvider>
      </UserPreferencesProvider>
    </MarketMetadataProvider>
  )
}

interface Props {
  args: ConversionProps
}

export const Default: Props = Template.bind({})
Default.args = {
  price: '11.12333'
}

export const HideApproximateSymbol: Props = Template.bind({})
HideApproximateSymbol.args = {
  price: '11.12333',
  hideApproximateSymbol: true
}
