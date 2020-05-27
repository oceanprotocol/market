import React from 'react'
import styles from './BaseDialog.module.css'
import { Modal } from 'react-responsive-modal'

export default function BaseDialog({
  open,
  title,
  onClose,
  children,
  disableClose,
  actions,
  ...other
}: {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
  disableClose?: boolean
  actions?: any
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      classNames={{
        overlay: 'customOverlay',
        modal: 'customModal'
      }}
      {...other}
    >
      <h2>{title}</h2>
      <p>{children}</p>
    </Modal>
  )
}
