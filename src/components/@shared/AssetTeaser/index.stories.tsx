import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { assetExtended } from '../../../../.jest/__mocks__/asset'
import AssetTeaser, { AssetTeaserProps } from '@shared/AssetTeaser'
import { UserPreferencesProvider } from '@context/UserPreferences'
import MarketMetadataProvider from '@context/MarketMetadata'

export default {
  title: 'Component/@shared/AssetTeaser',
  component: AssetTeaser
} as ComponentMeta<typeof AssetTeaser>

export const Template: ComponentStory<typeof AssetTeaser> = (
  args: AssetTeaserProps
) => {
  return (
    <MarketMetadataProvider>
      <UserPreferencesProvider>
        <AssetTeaser {...args} />
      </UserPreferencesProvider>
    </MarketMetadataProvider>
  )
}

interface Props {
  args: AssetTeaserProps
}

export const Default: Props = Template.bind({})

Default.args = {
  asset: assetExtended
}
