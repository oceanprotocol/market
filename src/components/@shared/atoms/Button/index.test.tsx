import React from 'react'
import { render, screen } from '@testing-library/react'
import Button from './'

test('returns correct markup when href or to is passed', async () => {
  const { rerender } = render(
    <Button href="https://oceanprotocol.com">Hello Button</Button>
  )

  let button = screen.getByText('Hello Button')
  expect(button).toHaveAttribute('href', 'https://oceanprotocol.com')
  expect(button).toContainHTML('<a')

  rerender(<Button to="/publish">Hello Button</Button>)
  button = screen.getByText('Hello Button')
  expect(button).toHaveAttribute('href', '/publish')
  expect(button).toContainHTML('<a')
})

test('returns correct markup when no href or to is passed', async () => {
  render(<Button>Hello Button</Button>)

  const button = screen.getByText('Hello Button')
  expect(button).toContainHTML('<button')
})
