import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import URLInput, { URLInputProps } from './index'
import { useField } from 'formik'

jest.mock('formik')

const props: URLInputProps = {
  submitText: 'Submit',
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

describe('@shared/FormInput/InputElement/URLInput', () => {
  it('renders without crashing', () => {
    const mockField = {
      value: '',
      checked: false,
      onChange: jest.fn(),
      onBlur: jest.fn(),
      name: 'url'
    }
    ;(useField as jest.Mock).mockReturnValue([mockField, mockMeta])

    render(<URLInput {...props} />)
    expect(screen.getByRole('button')).toBeDisabled()

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
      name: 'url'
    }
    ;(useField as jest.Mock).mockReturnValue([mockField, mockMeta])

    render(<URLInput {...props} />)
    expect(screen.getByRole('button')).toBeEnabled()
    fireEvent.click(screen.getByRole('button'))
  })
})
