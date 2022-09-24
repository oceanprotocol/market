import React from 'react'
import testRender from '../../../../../.jest/testRender'
import Avatar from '@shared/atoms/Avatar'
import { DefaultWithBlockies, CustomSource, Empty } from './index.stories'
import { render } from '@testing-library/react'

describe('Avatar', () => {
  testRender(<Avatar {...DefaultWithBlockies.args} />)

  it('renders without crashing with custom source', () => {
    const { container } = render(<Avatar {...CustomSource.args} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders empty without crashing', () => {
    const { container } = render(<Avatar {...Empty.args} />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
