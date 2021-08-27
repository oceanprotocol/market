import React from 'react'
import { render } from '@testing-library/react'
import PrivacyHeader from '../../../src/components/molecules/PrivacyHeader'
import PrivacyLanguages from '../../../src/components/atoms/PrivacyLanguages'

const privacyPolicy = {
  tableOfContents: 'toc',
  policy: 'en'
}

describe('PrivacyLanguages', () => {
  it('renders correctly without crashing', () => {
    const label = 'TEST'
    const { container } = render(<PrivacyLanguages label={label} />)

    expect(container.firstChild).toBeInTheDocument()
    expect(container).toHaveTextContent(label)
  })
})

describe('PrivacyHeader', () => {
  it('renders correctly without crashing', () => {
    const { container } = render(<PrivacyHeader {...privacyPolicy} />)

    expect(container.firstChild).toBeInTheDocument()
  })
})
