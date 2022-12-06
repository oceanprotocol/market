import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import FilesInput from './index'
import { useField } from 'formik'
import { getFileInfo } from '@utils/provider'

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
    ;(getFileInfo as jest.Mock).mockReturnValue([
      {
        valid: true,
        url: 'https://hello.com',
        type: 'url',
        contentType: 'text/html',
        contentLength: 100
      }
    ])

    render(<FilesInput form={mockForm} field={mockField} {...props} />)
    expect(screen.getByText('Validate')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Validate'))

    // can't really re-mock our helpers.setValue() behavior switching
    // to Info component, so we just wait for Validate button to be back again.
    await screen.findByText('Validate')
    expect(mockHelpers.setValue).toHaveBeenCalled()
  })

  it('renders fileinfo when file url is valid', () => {
    ;(useField as jest.Mock).mockReturnValue([
      {
        value: [
          {
            valid: true,
            url: 'https://hello.com',
            type: 'url',
            contentType: 'text/html',
            contentLength: 100
          }
        ]
      },
      mockMeta,
      mockHelpers
    ])
    render(<FilesInput {...props} field={mockField} />)
    expect(screen.getByText('https://hello.com')).toBeInTheDocument()
  })

  it('renders fileinfo when ipfs is valid', () => {
    ;(useField as jest.Mock).mockReturnValue([
      {
        value: [
          {
            valid: true,
            hash: 'bafkreicxccbk4blsx5qtovqfgsuutxjxom47dvyzyz3asi2ggjg5ipwlc4',
            type: 'ipfs',
            contentLength: '40492',
            contentType: 'text/csv',
            index: 0
          }
        ]
      },
      mockMeta,
      mockHelpers
    ])
    render(<FilesInput {...props} field={mockField} />)
    expect(screen.getByText('✓ File confirmed')).toBeInTheDocument()
  })

  it('renders fileinfo when arweave is valid', () => {
    ;(useField as jest.Mock).mockReturnValue([
      {
        value: [
          {
            valid: true,
            transactionId: 'T6NL8Zc0LCbT3bF9HacAGQC4W0_hW7b3tXbm8OtWtlA',
            type: 'arweave',
            contentLength: '57043',
            contentType: 'image/jpeg',
            index: 0
          }
        ]
      },
      mockMeta,
      mockHelpers
    ])
    render(<FilesInput {...props} field={mockField} />)
    expect(screen.getByText('✓ File confirmed')).toBeInTheDocument()
  })

  it('renders fileinfo without contentType', () => {
    ;(useField as jest.Mock).mockReturnValue([
      {
        value: [
          {
            valid: true,
            url: 'https://hello.com',
            type: 'url',
            contentLength: 100
          }
        ]
      },
      mockMeta,
      mockHelpers
    ])
    render(<FilesInput {...props} field={mockField} />)
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
    render(<FilesInput {...props} field={mockField} />)
    expect(
      screen.getByText('https://oceanprotocol/placeholder')
    ).toBeInTheDocument()
  })
})
