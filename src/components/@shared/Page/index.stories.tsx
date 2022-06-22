import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Page, { PageProps } from '@shared/Page'

export default {
  title: 'Component/@shared/Page',
  component: Page
} as ComponentMeta<typeof Page>

const Template: ComponentStory<typeof Page> = (args: PageProps) => (
  <Page {...args} />
)

interface Props {
  args: PageProps
}

export const Default: Props = Template.bind({})
Default.args = {
  uri: 'https://www.market.oceanprotocol.com',
  children: (
    <a>
      A marketplace to find, publish and trade data sets in the Ocean Network.
    </a>
  )
}

export const WithDescription: Props = Template.bind({})
WithDescription.args = {
  ...Default.args,
  description:
    'Data owners and consumers use Ocean Market app to publish, discover, and consume data in a secure, privacy-preserving fashion. OCEAN holders stake liquidity to data pools.'
}

export const WithTitle: Props = Template.bind({})
WithTitle.args = {
  ...WithDescription.args,
  title: 'Ocean Market'
}
