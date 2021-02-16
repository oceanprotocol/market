import React from 'react'
import { render } from '@testing-library/react'
import Publish from '../../../src/components/pages/Publish'
import content from '../../../content/pages/publish.json'
import contentAlgo from '../../../content/pages/publishAlgo.json'

describe('Home', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Publish content={content} contentAlgoPublish={contentAlgo} />
    )
    expect(container.firstChild).toBeInTheDocument()
  })
})
