import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import CookieModule, {
  CookieModuleProps
} from '../../../src/components/molecules/CookieModule'
import CookieConsent, {
  ConsentContext,
  ConsentProviderValue,
  CookieConsentStatus
} from '../../../src/providers/CookieConsent'
import { useGdprMetadata } from '../../../src/hooks/useGdprMetadata'

const cookieProps: CookieModuleProps = {
  title: 'Title',
  desc: 'Description',
  cookieName: 'CookieName'
}

jest.resetModules()

describe('CookieModule', () => {
  it('renders correctly without crashing', () => {
    const { container } = render(
      <CookieConsent>
        <CookieModule {...cookieProps} />
      </CookieConsent>
    )

    const moduleWrapper = container.querySelector('.wrapper')
    const moduleHeader = moduleWrapper.querySelector('.header')
    const moduleSwitch = moduleWrapper.querySelector('.switch')
    const moduleDesc = moduleWrapper.querySelector('.description')

    expect(moduleWrapper).toBeInTheDocument()
    expect(moduleHeader).toBeInTheDocument()
    expect(moduleSwitch).toBeInTheDocument()
    expect(moduleDesc).toBeInTheDocument()
  })

  const cookieConsentStatusApproved = {
    [cookieProps.cookieName]: CookieConsentStatus.APPROVED
  }
  const testValue: ConsentProviderValue = {
    cookies: useGdprMetadata().optionalCookies,
    cookieConsentStatus: cookieConsentStatusApproved,
    setConsentStatus: jest.fn(),
    resetConsentStatus: jest.fn()
  }

  it('initializes switch correctly', () => {
    // CookieConsentStatus not available
    const { container } = render(
      <ConsentContext.Provider value={testValue}>
        <CookieModule {...cookieProps} />
      </ConsentContext.Provider>
    )
    const switchInput = container.querySelector('input')
    expect(switchInput).toHaveProperty('checked', true)
  })
})
