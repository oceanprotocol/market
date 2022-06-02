import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { assetExtended, locale } from '../../../../.storybook/__mockdata__'
import AssetTeaser, { AssetTeaserProps } from '@shared/AssetTeaser'

export default {
  title: 'Component/@shared/AssetTeaser',
  component: AssetTeaser
} as ComponentMeta<typeof AssetTeaser>

const Template: ComponentStory<typeof AssetTeaser> = (
  args: AssetTeaserProps
) => {
  return <AssetTeaser {...args} />
}

interface Props {
  args: AssetTeaserProps
}

export const Default: Props = Template.bind({})
Default.args = {
  locale,
  asset: assetExtended
}
