import { BoxSelectionOption } from '@shared/FormInput/InputElement/BoxSelection'
import { AssetSelectionAsset } from '@shared/FormInput/InputElement/AssetSelection'
import { render, screen } from '@testing-library/react'
import React from 'react'
import FormInput from './index'

describe('@shared/FormInput', () => {
  it('renders without crashing', () => {
    render(
      <FormInput
        type="text"
        name="Hello Name"
        label="Hello Label"
        placeholder="Hello Placeholder"
        required
        help="Hello Help"
      />
    )
    expect(screen.getByText('Hello Label')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Hello Placeholder')).toBeInTheDocument()
  })

  it('renders prominent help', () => {
    render(<FormInput type="text" help="Hello Help" prominentHelp />)
    expect(screen.getByText('Hello Help')).toBeInTheDocument()
  })

  it('renders disclaimer', () => {
    render(<FormInput type="text" disclaimer="Hello Disclaimer" />)
    expect(screen.getByText('Hello Disclaimer')).toBeInTheDocument()
  })

  it('renders with prefix & postfix', () => {
    render(
      <FormInput type="text" prefix="Hello Prefix" postfix="Hello Postfix" />
    )
    expect(screen.getByText('Hello Prefix')).toBeInTheDocument()
    expect(screen.getByText('Hello Postfix')).toBeInTheDocument()
  })

  it('renders textarea', () => {
    render(<FormInput type="textarea" />)
  })

  it('renders radio', () => {
    render(<FormInput type="radio" options={['option1', 'option2']} />)
  })

  it('renders checkbox', () => {
    render(<FormInput type="checkbox" options={['option1', 'option2']} />)
  })

  it('renders select', () => {
    render(<FormInput type="select" options={['option1', 'option2']} />)
  })

  it('renders assetSelection', () => {
    const assets: AssetSelectionAsset[] = [
      {
        did: 'did:op:xxx',
        name: 'Asset',
        price: 10,
        checked: false,
        symbol: 'OCEAN'
      },
      {
        did: 'did:op:yyy',
        name: 'Asset',
        price: 10,
        checked: true,
        symbol: 'OCEAN'
      }
    ]
    render(<FormInput type="assetSelection" options={assets} />)
  })

  it('renders assetSelectionMultiple', () => {
    render(<FormInput type="assetSelectionMultiple" />)
  })

  it('renders boxSelection', () => {
    const options: BoxSelectionOption[] = [
      {
        name: 'option1',
        title: 'Option 1',
        checked: true,
        text: 'Option 1 Text',
        icon: <div>Icon</div>
      },
      {
        name: 'option2',
        title: 'Option 2',
        checked: true
      }
    ]

    render(
      <FormInput
        type="boxSelection"
        options={options}
        onChange={() => jest.fn()}
      />
    )
  })
})
