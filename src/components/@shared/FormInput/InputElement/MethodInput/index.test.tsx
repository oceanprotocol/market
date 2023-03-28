import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import MethodInput, { MethodInputProps } from './index'
import { useField } from 'formik'

jest.mock('formik')

const props: MethodInputProps = {
  handleButtonClick: jest.fn(),
  isLoading: false,
  name: 'Hello Name'
}

const mockMeta = {
  touched: false,
  error: '',
  initialError: '',
  initialTouched: false,
  initialValue: '',
  value: ''
}

describe('@shared/FormInput/InputElement/MethodInput', () => {
  it('renders without crashing', () => {
    const mockField = {
      value: '',
      checked: false,
      onChange: jest.fn(),
      onBlur: jest.fn(),
      name: 'url',
      method: 'get'
    }
    ;(useField as jest.Mock).mockReturnValue([mockField, mockMeta])

    render(<MethodInput {...props} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'https://google.com' }
    })
  })

  it('renders button enabled with value', () => {
    const mockField = {
      value: 'https://google.com',
      checked: false,
      onChange: jest.fn(),
      onBlur: jest.fn(),
      name: 'url',
      method: 'get'
    }
    ;(useField as jest.Mock).mockReturnValue([mockField, mockMeta])

    render(<MethodInput {...props} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('textbox'))
  })
})
