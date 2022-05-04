import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Container from '@shared/atoms/Container'
import styles from './index.module.css'

export default {
  title: 'Component/@shared/atoms/Container',
  component: Container
} as ComponentMeta<typeof Container>

const Template: ComponentStory<typeof Container> = (args) => (
  <Container {...args} />
)

interface Props {
  args: {
    narrow: boolean
    // children: string
    className: string
  }
}

export const Primary: Props = Template.bind({})
Primary.args = {
  narrow: true,
  // children: 'Button',
  className: styles.container || 'className'
}
