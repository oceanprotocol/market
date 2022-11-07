import React from 'react'
import testRender from '../../../../../.jest/testRender'
import Loader, { LoaderProps } from '@shared/atoms/Loader'
import { Default, WithMessage } from './index.stories'
import { render } from '@testing-library/react'

describe('Loader', () => {
  testRender(<Loader {...Default.args} />)

  it('renders without wordmark', () => {
    render(<Loader {...WithMessage.args} />)
  })

  it('renders white', () => {
    const props: LoaderProps = { white: true }
    render(<Loader {...props} />)
  })
})
