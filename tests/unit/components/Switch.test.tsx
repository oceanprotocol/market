import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Switch from '../../../src/components/atoms/Switch'
import slugify from 'slugify'

const name = 'TestSwitch'

describe('Switch', () => {
  it('renders correctly without crashing', () => {
    const { container } = render(<Switch name={name} />)

    const switchContainer = container.querySelector('.container')
    const switchLabel = switchContainer.querySelector('label')
    const switchInput = switchLabel.querySelector('input')
    const switchSlider = switchLabel.querySelector('.slider')

    expect(switchContainer).toBeInTheDocument()
    expect(switchLabel).toBeInTheDocument()
    expect(switchLabel).toHaveAttribute('for', slugify(name))
    expect(switchInput).toBeInTheDocument()
    expect(switchInput).toHaveAttribute('id', slugify(name))
    expect(switchSlider).toBeInTheDocument()
  })

  it('renders with correct styling', () => {
    const { container } = render(<Switch name={name} size="small" />)

    const switchContainer = container.querySelector('.container')
    expect(switchContainer).toHaveClass('small')
  })

  it('initializes checked correctly', () => {
    const containerChecked = render(<Switch name={name} isChecked />).container
    const switchInputChecked = containerChecked.querySelector('input')

    expect(switchInputChecked).toHaveProperty('checked', true)

    const containerUnchecked = render(
      <Switch name={name} isChecked={false} />
    ).container
    const switchInputUnchecked = containerUnchecked.querySelector('input')

    expect(switchInputUnchecked).toHaveProperty('checked', false)
  })

  it('calls onChange function', () => {
    const onChange = jest.fn((checked: boolean) => {
      return checked
    })

    const { container } = render(
      <Switch name={name} size="small" onChange={onChange} />
    )

    const switchSlider = container.querySelector('.slider')

    fireEvent(
      switchSlider,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    )

    expect(onChange).toHaveBeenCalled()
  })
})
