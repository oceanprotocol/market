import React from 'react'
import { render, screen } from '@testing-library/react'
import Publisher from './'

const account = '0x0000000000000000000000000000000000000000'

test('should return correct markup by default', async () => {
  render(<Publisher account={account} />)

  const element = await screen.findByRole('link')
  expect(element).toContainHTML('<a')
  expect(element).toHaveAttribute('href', `/profile/${account}`)
})

test('should truncate account by default', async () => {
  render(<Publisher account={account} />)

  const element = await screen.findByText('0x…00000000')
  expect(element).toBeInTheDocument()
})

test('should return correct markup in minimal state', async () => {
  render(<Publisher minimal account={account} />)

  const element = await screen.findByText('0x…00000000')
  expect(element).not.toHaveAttribute('href')
})

test('should return markup with empty account', async () => {
  render(<Publisher account={null} />)

  const element = await screen.findByRole('link')
  expect(element).toBeInTheDocument()
})
