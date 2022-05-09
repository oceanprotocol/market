import React, { useState } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Modal, { ModalProps } from '@shared/atoms/Modal'
import Button from '../Button'

export default {
  title: 'Component/@shared/atoms/Modal',
  component: Modal
} as ComponentMeta<typeof Modal>

const Template: ComponentStory<typeof Modal> = (args: ModalProps) => (
  <Modal {...args} />
)

interface Props {
  args: {
    isOpen: boolean
    title: string
    onToggleModal: () => void
    children: any
  }
}

export const Primary: Props = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Button style="text" size="small" onClick={() => setIsDialogOpen(true)}>
        Show Details
      </Button>
      <Modal
        title="Modal opened"
        isOpen={isDialogOpen}
        onToggleModal={() => setIsDialogOpen(false)}
      >
        <p>Click ✗ to close this up!</p>
      </Modal>
    </>
  )
}

Primary.args = {
  isOpen: true,
  title: 'Modal title',
  children: <p>Modal child</p>,
  onToggleModal: () => {
    console.log('Button pressed!')
  }
}
