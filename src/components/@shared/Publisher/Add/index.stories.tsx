import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Add from '@shared/Publisher/Add'

export default {
  title: 'Component/@shared/Add',
  component: Add
} as ComponentMeta<typeof Add>

const Template: ComponentStory<typeof Add> = () => <Add />

export const Default = Template.bind({})
