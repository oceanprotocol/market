import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import FilesInput from './index'
import { useField } from 'formik'
import { getFileInfo, checkValidProvider } from '@utils/provider'

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

const mockFieldUrl = {
  value: 'https://hello.com',
  checked: false,
  onChange: jest.fn(),
  onBlur: jest.fn(),
  name: 'url'
}

const mockFieldIpfs = {
  value: 'bafkreicxccbk4blsx5qtovqfgsuutxjxom47dvyzyz3asi2ggjg5ipwlc4',
  checked: false,
  onChange: jest.fn(),
  onBlur: jest.fn(),
  name: 'ipfs'
}

const mockFieldArwave = {
  value: 'T6NL8Zc0LCbT3bF9HacAGQC4W0_hW7b3tXbm8OtWtlA',
  checked: false,
  onChange: jest.fn(),
  onBlur: jest.fn(),
  name: 'arweave'
}

const mockFieldGraphQL = {
  value:
    'https://v4.subgraph.mumbai.oceanprotocol.com/subgraphs/name/oceanprotocol/ocean-subgraph',
  checked: false,
  onChange: jest.fn(),
  onBlur: jest.fn(),
  name: 'graphql'
}

const mockFieldSM = {
  value: '0x564955E9d25B49afE5Abd66966Ab4Bc9Ad55Fedb',
  checked: false,
  onChange: jest.fn(),
  onBlur: jest.fn(),
  name: 'smartcontract'
}

const mockHelpers = {
  setValue: jest.fn(),
  setTouched: jest.fn()
}

const mockForm = {
  values: {
    services: [
      {
        providerUrl: {
          url: 'https://v4.provider.mainnet.oceanprotocol.com'
        }
      }
    ]
  },
  errors: {},
  touched: {},
  isSubmitting: false,
  isValidating: false,
  submitCount: 0,
  setFieldError: jest.fn()
}

describe('@shared/FormInput/InputElement/FilesInput', () => {
  it('renders URL without crashing', async () => {
    ;(useField as jest.Mock).mockReturnValue([
      mockFieldUrl,
      mockMeta,
      mockHelpers
    ])
    ;(checkValidProvider as jest.Mock).mockReturnValue(true)
    ;(getFileInfo as jest.Mock).mockReturnValue([
      {
        valid: true,
        url: 'https://hello.com',
        type: 'url',
        contentType: 'text/html',
        contentLength: 100
      }
    ])

    render(<FilesInput form={mockForm} field={mockFieldUrl} {...props} />)
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
    render(<FilesInput {...props} field={mockFieldUrl} />)
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
    render(<FilesInput {...props} field={mockFieldIpfs} />)
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
    render(<FilesInput {...props} field={mockFieldArwave} />)
    expect(screen.getByText('✓ File confirmed')).toBeInTheDocument()
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
    render(<FilesInput {...props} field={mockFieldUrl} />)
    expect(
      screen.getByText('https://oceanprotocol/placeholder')
    ).toBeInTheDocument()
  })

  it('renders fileinfo when graphql is valid', () => {
    ;(useField as jest.Mock).mockReturnValue([
      {
        value: [
          {
            type: 'graphql',
            valid: true,
            url: 'https://v4.subgraph.mumbai.oceanprotocol.com/subgraphs/name/oceanprotocol/ocean-subgraph',
            query:
              'query{\n            nfts(orderBy: createdTimestamp,orderDirection:desc){\n                 id\n                 symbol\n                 createdTimestamp\n            }\n           }',
            checksum: false
          }
        ]
      },
      mockMeta,
      mockHelpers
    ])
    render(<FilesInput {...props} field={mockFieldGraphQL} />)
  })

  it('renders fileinfo when smart contract is valid', () => {
    ;(useField as jest.Mock).mockReturnValue([
      {
        value: [
          {
            chainId: 80001,
            type: 'smartcontract',
            address: '0x564955E9d25B49afE5Abd66966Ab4Bc9Ad55Fedb',
            abi: {
              inputs: [],
              name: 'swapOceanFee',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256'
                }
              ],
              stateMutability: 'view',
              type: 'function'
            },
            valid: true
          }
        ]
      },
      mockMeta,
      mockHelpers
    ])
    render(<FilesInput {...props} field={mockFieldSM} />)
  })
})
