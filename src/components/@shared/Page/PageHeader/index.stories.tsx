import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import PageHeader, { PageHeaderProps } from '@shared/Page/PageHeader'

export default {
  title: 'Component/@shared/PageHeader',
  component: PageHeader
} as ComponentMeta<typeof PageHeader>

const Template: ComponentStory<typeof PageHeader> = (args: PageHeaderProps) => (
  <PageHeader {...args} />
)

interface Props {
  args: PageHeaderProps
}

export const Default: Props = Template.bind({})
Default.args = {
  title: <a>Ocean Protocol Market</a>
}

export const Centered: Props = Template.bind({})
Centered.args = {
  title: <a>Ocean Protocol Market</a>,
  center: true
}

export const WithDescription: Props = Template.bind({})
WithDescription.args = {
  title: <a>Ocean Protocol Market</a>,
  center: true,
  description:
    'A marketplace to find, publish and trade data sets in the Ocean Network.'
}
