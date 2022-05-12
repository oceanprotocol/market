import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Button, { ButtonProps } from '@shared/atoms/Button'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Component/@shared/atoms/Button',
  component: Button
} as ComponentMeta<typeof Button>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args: ButtonProps) => (
  <Button {...args} />
)

interface Props {
  args: ButtonProps
}

export const Default: Props = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  children: 'Button',
  onClick: () => {
    console.log('Button pressed!')
  }
}

export const Primary: Props = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  children: 'Button',
  style: 'primary',
  onClick: () => {
    console.log('Button pressed!')
  }
}

export const Small: Props = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Small.args = {
  children: 'Button',
  size: 'small',
  onClick: () => {
    console.log('Button pressed!')
  }
}
