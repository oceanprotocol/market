import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import FilesInput from './index'
import { useField } from 'formik'
import { getFileUrlInfo } from '@utils/provider'

jest.mock('formik')
jest.mock('@utils/provider')

const props = {
  name: 'File'
}

const mockMeta = {
  touched: false,
  error: '',
  initialError: '',
  initialTouched: false,
  initialValue: '',
  value: ''
}

const mockField = {
  value: 'https://hello.com',
  checked: false,
  onChange: jest.fn(),
  onBlur: jest.fn(),
  name: 'url'
}

const mockHelpers = {
  setValue: jest.fn(),
  setTouched: jest.fn()
}

const mockForm = {
  values: {
    services: [{ providerUrl: 'https://provider.url' }]
  },
  errors: {},
  touched: {},
  isSubmitting: false,
  isValidating: false,
  submitCount: 0,
  setFieldError: jest.fn()
}

describe('@shared/FormInput/InputElement/FilesInput', () => {
  it('renders without crashing', async () => {
    ;(useField as jest.Mock).mockReturnValue([mockField, mockMeta, mockHelpers])
    ;(getFileUrlInfo as jest.Mock).mockReturnValue([
      {
        valid: true,
        url: 'https://hello.com',
        contentType: 'text/html',
        contentLength: 100
      }
    ])

    render(<FilesInput form={mockForm} {...props} />)
    expect(screen.getByText('Validate')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Validate'))

    // can't really re-mock our helpers.setValue() behavior switching
    // to Info component, so we just wait for Validate button to be back again.
    await screen.findByText('Validate')
    expect(mockHelpers.setValue).toHaveBeenCalled()
  })

  it('renders fileinfo when file is valid', () => {
    ;(useField as jest.Mock).mockReturnValue([
      {
        value: [
          {
            valid: true,
            url: 'https://hello.com',
            contentType: 'text/html',
            contentLength: 100
          }
        ]
      },
      mockMeta,
      mockHelpers
    ])
    render(<FilesInput {...props} />)
    expect(screen.getByText('https://hello.com')).toBeInTheDocument()
  })

  it('renders fileinfo without contentType', () => {
    ;(useField as jest.Mock).mockReturnValue([
      {
        value: [
          {
            valid: true,
            url: 'https://hello.com',
            contentLength: 100
          }
        ]
      },
      mockMeta,
      mockHelpers
    ])
    render(<FilesInput {...props} />)
  })

  it('renders fileinfo placeholder when hideUrl is passed', () => {
    ;(useField as jest.Mock).mockReturnValue([
      {
        value: [
          {
            valid: true,
            url: 'https://hello.com',
            type: 'hidden'
          }
        ]
      },
      mockMeta,
      mockHelpers
    ])
    render(<FilesInput {...props} />)
    expect(
      screen.getByText('https://oceanprotocol/placeholder')
    ).toBeInTheDocument()
  })
})
