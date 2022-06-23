import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import RefreshName, {
  RefreshNameProps
} from '@shared/FormFields/Datatoken/RefreshName'

export default {
  title: 'Component/@shared/FormFields/Datatoken/RefreshName',
  component: RefreshName
} as ComponentMeta<typeof RefreshName>

const Template: ComponentStory<typeof RefreshName> = (
  args: RefreshNameProps
) => <RefreshName {...args} />

interface Props {
  args: RefreshNameProps
}

export const Default: Props = Template.bind({})
Default.args = {
  generateName: () => {
    console.log('A new name generated!')
  }
}
