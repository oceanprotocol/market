import BoxSelection, { BoxSelectionOption } from './'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

describe('@shared/FormInput/InputElement/BoxSelection', () => {
  const handleChange = jest.fn()
  const options: BoxSelectionOption[] = [
    {
      name: 'option1',
      value: 'option1',
      title: 'Option 1',
      checked: true,
      text: 'Option 1 Text',
      icon: <div>Icon</div>
    },
    {
      name: 'option2',
      title: 'Option 2 Text',
      checked: false
    }
  ]

  it('renders without crashing', () => {
    render(
      <BoxSelection name="box" options={options} handleChange={handleChange} />
    )
    fireEvent.click(screen.getByText('Option 2 Text'))
    expect(handleChange).toHaveBeenCalled()
  })

  it('renders disabled', () => {
    render(<BoxSelection name="box" options={options} disabled />)
  })

  it('renders loader without options', () => {
    render(<BoxSelection name="box" options={null} />)
  })
})
