import React, { ReactElement, ReactNode } from 'react'
import ReactModal from 'react-modal'
import styles from './index.module.css'

if (process.env.NODE_ENV !== 'test') ReactModal.setAppElement('#__next')

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
      className={styles.modal}
      overlayClassName={styles.modalOverlay}
      {...props}
    >
      <button
        className={styles.close}
        onClick={onToggleModal}
        data-testid="closeModal"
      >
        &times;
      </button>

      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </header>

      {children}
    </ReactModal>
  )
}
