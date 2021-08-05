import React from 'react'
import { render } from '@testing-library/react'
import CookieModule, {
  CookieModuleProps
} from '../../../src/components/molecules/CookieModule'
import CookieConsent from '../../../src/providers/CookieConsent'

const cookieProps: CookieModuleProps = {
  title: 'Title',
  desc: 'Description',
  cookieName: 'CookieName'
}

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
})
