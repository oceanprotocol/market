import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Container from '@shared/atoms/Container/index'
import styles from './index.module.css'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Component/@shared/atoms/Container',
  component: Container
} as ComponentMeta<typeof Container>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Container> = (args) => (
  <Container {...args} />
)

interface Props {
  args: {
    narrow: boolean
    children: string
    className: string
  }
}

export const Primary: Props = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  narrow: true,
  children: 'Button',
  className: styles.container || 'className'
}
