import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Default } from './index.stories'

describe('Tabs', () => {
  test('should be able to change', async () => {
    render(<Default {...Default.args} />)

    fireEvent.click(screen.getByText('Second tab'))
    const secondTab = await screen.findByText(/content for the second tab/i)
    expect(secondTab).toBeInTheDocument()
  })

  test('should fire custom change handler', async () => {
    const handler = jest.fn()
    render(<Default {...Default.args} handleTabChange={handler} />)

    fireEvent.click(screen.getByText('Second tab'))
    expect(handler).toBeCalledTimes(1)
  })
})
