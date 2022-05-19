import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Default } from './index.stories'

test('Tabs can be changed', async () => {
  render(<Default {...Default.args} />)

  fireEvent.click(screen.getByText('Second tab'))
  const secondTab = await screen.findByText(/content for the second tab/i)
  expect(secondTab).toBeInTheDocument()
})

test('Custom tab change handler fires', async () => {
  const handler = jest.fn()
  render(<Default {...Default.args} handleTabChange={handler} />)

  fireEvent.click(screen.getByText('Second tab'))
  expect(handler).toBeCalledTimes(1)
})
