import React from 'react'
import { render } from '@testing-library/react'
import Modal from '@shared/atoms/Modal'
import ReactModal from 'react-modal'

if (process.env.NODE_ENV !== 'test') ReactModal.setAppElement('#__next')

describe('Modal', () => {
  it('renders without crashing', () => {
    ReactModal.setAppElement(document.createElement('div'))

    render(
      <Modal title="Hello" isOpen onToggleModal={() => null}>
        Hello
      </Modal>
    )
    // eslint-disable-next-line testing-library/no-node-access
    expect(document.querySelector('.ReactModalPortal')).toBeInTheDocument()
  })
})
