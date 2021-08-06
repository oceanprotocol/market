import React from 'react'
import { render } from '@testing-library/react'
import PrivacyPolicy from '../../../src/components/molecules/PrivacyPolicy'

const privacyPolicy = {
  tableOfContents: 'toc',
  html: 'html',
  date: '2021-08-01',
  params: {
    languageLabel: 'Language',
    languageHelp: 'Help',
    tocHeader: 'Header',
    updated: 'Updated',
    dateFormat: 'dd-MM-yyy'
  }
}

describe('PrivacyPolicy', () => {
  it('renders correctly without crashing', () => {
    const { container } = render(<PrivacyPolicy {...privacyPolicy} />)

    expect(container.firstChild).toBeInTheDocument()
  })
})
