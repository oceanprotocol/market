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
    render(<FormInput type="assetSelection" />)
  })

  it('renders assetSelectionMultiple', () => {
    render(<FormInput type="assetSelectionMultiple" />)
  })

  it('renders boxSelection', () => {
    render(<FormInput type="boxSelection" />)
  })
})
