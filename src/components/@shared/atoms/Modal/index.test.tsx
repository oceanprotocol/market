import React from 'react'
import { render } from '@testing-library/react'
import Modal from './'
import ReactModal from 'react-modal'

describe('Modal', () => {
  it('renders without crashing', () => {
    ReactModal.setAppElement(document.createElement('div'))

    const { rerender } = render(
      <Modal title="Hello" isOpen onToggleModal={() => null}>
        Hello
      </Modal>
    )
    expect(document.querySelector('.ReactModalPortal')).toBeInTheDocument()

    rerender(
      <Modal title="Hello" isOpen={false} onToggleModal={() => null}>
        Hello
      </Modal>
    )
  })
})
