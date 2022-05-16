import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Modal, { ModalProps } from '@shared/atoms/Modal'

export default {
  title: 'Component/@shared/atoms/Modal',
  component: Modal
} as ComponentMeta<typeof Modal>

const Template: ComponentStory<typeof Modal> = (args) => <Modal {...args} />

interface Props {
  args: ModalProps
}

export const Default: Props = Template.bind({})
Default.args = {
  isOpen: true,
  title: 'Modal title',
  onToggleModal: () => {
    console.log('Modal opened')
  },
  children: (
    <>
      <a>This is a modal</a>
    </>
  )
}
