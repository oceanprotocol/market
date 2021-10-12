import React from 'react'
import { render } from '@testing-library/react'
import PrivacyPreferenceCenter from '../../../src/components/organisms/PrivacyPreferenceCenter'

jest.resetModules()

describe('privacyPreferenceCenter', () => {
  it('renders correctly without crashing', () => {
    const { container } = render(<PrivacyPreferenceCenter />)

    const moduleWrapper = container.querySelector('.wrapper')

    expect(moduleWrapper).toBeInTheDocument()
  })

  it('initializes small styling correctly', () => {
    // CookieConsentStatus not available
    const { container } = render(<PrivacyPreferenceCenter style="small" />)

    const moduleWrapper = container.querySelector('.small.wrapper')
    expect(moduleWrapper).toBeInTheDocument()
  })
})
