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
