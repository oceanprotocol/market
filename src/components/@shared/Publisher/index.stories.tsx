import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Publisher, { PublisherProps } from '@shared/Publisher'
import MarketMetadataProvider from '@context/MarketMetadata'

export default {
  title: 'Component/@shared/Publisher',
  component: Publisher
} as ComponentMeta<typeof Publisher>

const Template: ComponentStory<typeof Publisher> = (args: PublisherProps) => (
  <Publisher {...args} />
)

interface Props {
  args: PublisherProps
}

export const Default: Props = Template.bind({})
Default.args = {
  account: '0x134B4eDd7dE8Ea003E721e7670800BA97D9AF1fd'
}

export const MinimalProfile: Props = Template.bind({})
MinimalProfile.args = {
  account: '0x134B4eDd7dE8Ea003E721e7670800BA97D9AF1fd',
  minimal: true
}
