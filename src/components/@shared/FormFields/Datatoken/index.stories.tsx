import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Datatoken from '@shared/FormFields/Datatoken'
import { InputProps } from '@shared/FormInput'

export default {
  title: 'Component/@shared/FormFields/Datatoken',
  component: Datatoken
} as ComponentMeta<typeof Datatoken>

const Template: ComponentStory<typeof Datatoken> = (args: InputProps) => (
  <Datatoken {...args} />
)

interface Props {
  args: InputProps
}

export const Default: Props = Template.bind({})
Default.args = {
  name: 'PARCOUR-73'
}
