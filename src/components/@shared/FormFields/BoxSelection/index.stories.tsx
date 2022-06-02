import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import BoxSelection, {
  BoxSelectionProps
} from '@shared/FormFields/BoxSelection'

export default {
  title: 'Component/@shared/FormFields/BoxSelection',
  component: BoxSelection
} as ComponentMeta<typeof BoxSelection>

const Template: ComponentStory<typeof BoxSelection> = (
  args: BoxSelectionProps
) => <BoxSelection {...args} />

interface Props {
  args: BoxSelectionProps
}

const optionsList = [
  {
    name: 'option 1',
    value: 'option 1',
    checked: true,
    title: 'option 1'
  },
  {
    name: 'option 2',
    value: 'option 2',
    checked: false,
    title: 'option 2'
  },
  {
    name: 'option 3',
    value: 'option 3',
    checked: true,
    title: 'option 3'
  }
]

export const Default: Props = Template.bind({})
Default.args = {
  name: 'Box selection',
  options: optionsList
}

export const Disabled: Props = Template.bind({})
Disabled.args = {
  ...Default.args,
  disabled: true
}
