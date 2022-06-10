import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Seo, { SeoProps } from '@shared/Page/Seo'

export default {
  title: 'Component/@shared/Seo',
  component: Seo
} as ComponentMeta<typeof Seo>

const Template: ComponentStory<typeof Seo> = (args: SeoProps) => (
  <Seo {...args} />
)

interface Props {
  args: SeoProps
}

export const Default: Props = Template.bind({})
Default.args = {
  uri: 'https://www.market.oceanprotocol.com'
}

export const WithTitle: Props = Template.bind({})
WithTitle.args = {
  uri: 'https://www.market.oceanprotocol.com',
  title: 'Ocean Market'
}

export const WithDescription: Props = Template.bind({})
WithDescription.args = {
  ...WithTitle.args,
  description:
    'A marketplace to find, publish and trade data sets in the Ocean Network.'
}
