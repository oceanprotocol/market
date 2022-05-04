import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Modal, { ModalProps } from '@shared/atoms/Modal/index'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Component/@shared/atoms/Modal',
  component: Modal
} as ComponentMeta<typeof Modal>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Modal> = (args: ModalProps) => (
  <Modal {...args} />
)

interface Props {
  args: {
    title: string
    onToggleModal: () => void
    children: any
  }
}

export const Primary: Props = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  title: 'Modal title',
  children: 'Button',
  onToggleModal: () => {
    console.log('Button pressed!')
  }
}
