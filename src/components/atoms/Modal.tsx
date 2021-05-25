import React, { ReactElement, ReactNode } from 'react'
import ReactModal from 'react-modal'
import {
  modal,
  modalOverlay,
  close,
  header,
  title as titleStyle
} from './Modal.module.css'

if (process.env.NODE_ENV !== 'test') ReactModal.setAppElement('#___gatsby')

export interface ModalProps extends ReactModal.Props {
  title: string
  onToggleModal: () => void
  children: ReactNode
}

export default function Modal({
  title,
  onToggleModal,
  children,
  ...props
}: ModalProps): ReactElement {
  return (
    <ReactModal
      contentLabel={title}
      className={modal}
      overlayClassName={modalOverlay}
      {...props}
    >
      <button
        className={close}
        onClick={onToggleModal}
        data-testid="closeModal"
      >
        &times;
      </button>

      <header className={header}>
        <h2 className={titleStyle}>{title}</h2>
      </header>

      {children}
    </ReactModal>
  )
}
