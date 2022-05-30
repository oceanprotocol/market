import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import ExplorerLink, { ExplorerLinkProps } from '@shared/ExplorerLink'

export default {
  title: 'Component/@shared/ExplorerLink',
  component: ExplorerLink
} as ComponentMeta<typeof ExplorerLink>

const Template: ComponentStory<typeof ExplorerLink> = (
  args: ExplorerLinkProps
) => <ExplorerLink {...args} />

interface Props {
  args: ExplorerLinkProps
}

export const Default: Props = Template.bind({})
Default.args = {
  networkId: 1287,
  path: 'https://example.com',
  children: <p>Explorer link</p>
}
