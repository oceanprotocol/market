import React from 'react'
import { render } from '@testing-library/react'
import NProgress from '../../../src/components/atoms/NProgress'

describe('NProgress', () => {
  it('nprogress options can be passed', () => {
    const { container } = render(<NProgress options={{ minimum: 2 } as any} />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
