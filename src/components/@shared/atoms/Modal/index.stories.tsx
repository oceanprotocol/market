import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Button from '@shared/atoms/Button'
import Modal, { ModalProps } from '@shared/atoms/Modal'
import { useArgs } from '@storybook/client-api'

export default {
  title: 'Component/@shared/atoms/Modal',
  component: Modal
} as ComponentMeta<typeof Modal>

const Template: ComponentStory<typeof Modal> = (args: ModalProps) => {
  const [{ isOpen }, updateArgs] = useArgs()
  const handleClose = () => updateArgs({ isOpen: !isOpen })

  return (
    <>
      <Button style="primary" onClick={() => updateArgs({ isOpen: !isOpen })}>
        Open Modal
      </Button>
      <Modal {...args} onToggleModal={handleClose}>
        <a>This is a modal</a>
      </Modal>
    </>
  )
}

interface Props {
  args: ModalProps
}

export const Default: Props = Template.bind({})
