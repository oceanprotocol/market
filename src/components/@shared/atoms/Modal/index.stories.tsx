import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Modal, { ModalProps } from '@shared/atoms/Modal'

export default {
  title: 'Component/@shared/atoms/Modal',
  component: Modal
} as ComponentMeta<typeof Modal>

const Template: ComponentStory<typeof Modal> = (args: ModalProps) => (
  <Modal {...args} />
)

interface Props {
  args: {
    title: string
    onToggleModal: () => void
    // children: any
  }
}

export const Primary: Props = Template.bind({})
Primary.args = {
  title: 'Modal title',
  //   children: 'Button',
  onToggleModal: () => {
    console.log('Button pressed!')
  }
}
