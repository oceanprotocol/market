import React from 'react'
import { render, act, screen, fireEvent } from '@testing-library/react'
import { Default } from './index.stories'
import Copy from '.'

jest.useFakeTimers()

describe('Copy', () => {
  test('should change class on click', () => {
    render(<Copy {...Default.args} />)

    const element = screen.getByTitle('Copy to clipboard')
    fireEvent.click(element)
    expect(element).toHaveClass('copied')
  })

  test('should remove class after timer end', () => {
    render(<Copy {...Default.args} />)

    const element = screen.getByTitle('Copy to clipboard')
    fireEvent.click(element)

    act(() => {
      jest.advanceTimersToNextTimer()
    })
    expect(element).not.toHaveClass('copied')
  })
})
