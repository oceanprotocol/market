import React from 'react'
import { render } from '@testing-library/react'
import Button from '../../../src/components/atoms/Button'

describe('Button', () => {
  it('primary renders correctly', () => {
    const { container } = render(
      <Button style="primary">I am a primary button</Button>
    )

    const button = container.querySelector('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('primary')
    expect(button && button.className).toMatch(/primary/)
  })

  it('href renders correctly without crashing', () => {
    const { container } = render(
      <Button href="https://hello.com">I am a href button</Button>
    )
    const button = container.querySelector('a')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('href')
  })

  it('text renders correctly without crashing', () => {
    const { container } = render(
      <Button style="text">I am a text button</Button>
    )

    const button = container.querySelector('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('text')
    expect(button && button.className).toMatch(/text/)
  })
})
