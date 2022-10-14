import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import Nft from './index'
import { useField } from 'formik'

jest.mock('formik')

const props = {
  name: 'NFT'
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
  value: {
    name: '',
    symbol: '',
    description: '',
    external_url: '',
    background_color: '',
    image_data: ''
  },
  checked: false,
  onChange: jest.fn(),
  onBlur: jest.fn(),
  name: 'NFT'
}

const mockHelpers = {
  setValue: jest.fn()
}

describe('@shared/FormInput/InputElement/Nft', () => {
  it('renders without crashing', () => {
    ;(useField as jest.Mock).mockReturnValue([mockField, mockMeta, mockHelpers])
    render(<Nft {...props} />)
    fireEvent.click(screen.getByRole('button'))
  })

  it('does nothing when data already present', () => {
    ;(useField as jest.Mock).mockReturnValue([
      {
        value: {
          name: 'Hello Name'
        },
        checked: false,
        onChange: jest.fn(),
        onBlur: jest.fn(),
        name: 'NFT'
      },
      mockMeta,
      mockHelpers
    ])
    render(<Nft {...props} />)
  })
})
