import React, { ReactNode, ReactElement } from 'react'
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
  children: ReactNode
  disableClose?: boolean
  actions?: any
}): ReactElement {
  return (
    <Modal
      open={open}
      onClose={onClose}
      classNames={{
        overlay: styles.customOverlay,
        modal: styles.customModal
      }}
      {...other}
    >
      <h2>{title}</h2>
      <div>{children}</div>
    </Modal>
  )
}
