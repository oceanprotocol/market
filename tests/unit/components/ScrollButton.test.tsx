import React from 'react'
import {
  act,
  fireEvent,
  getByText,
  render,
  waitForElementToBeRemoved
} from '@testing-library/react'
import ScrollButton from '../../../src/components/atoms/ScrollButton'

describe('ScrollButton', () => {
  const scrollToId = 'myTestId'
  const children = 'Test'
  it('renders correctly without crashing', () => {
    const { container } = render(
      <ScrollButton
        scrollToId={scrollToId}
        calculateShowScrollButton={() => false}
      >
        {children}
      </ScrollButton>
    )

    expect(container.firstChild).toBeInTheDocument()
    expect(container).toHaveTextContent(children)
    expect(getByText(container, children)).toHaveAttribute(
      'href',
      `#${scrollToId}`
    )
  })

  test('calls calculate fn correctly', (done) => {
    const scrollOffset = 300
    const delay = 1 // for faster testing

    const calcFn = (offset: number) => {
      try {
        expect(offset).toBe(scrollOffset)
        done()
        return true
      } catch (error) {
        done(error)
        return false
      }
    }

    const { container } = render(
      <ScrollButton
        scrollToId={scrollToId}
        calculateShowScrollButton={calcFn}
        delay={delay}
      >
        {children}
      </ScrollButton>
    )
    fireEvent.scroll(window, { target: { pageYOffset: scrollOffset } })

    waitForElementToBeRemoved(container)
  })
})
