import { render } from '@testing-library/react'
import React from 'react'
import Tags from '.'
import {
  args,
  argsMaxNumberOfTags,
  argsShowMore,
  argsWithoutLinks
} from './index.stories'

describe('Tags', () => {
  it('renders without crashing', () => {
    render(<Tags {...args} />)
  })

  it('renders MaxNumberOfTags', () => {
    render(<Tags {...argsMaxNumberOfTags} />)
  })

  it('renders ShowMore', () => {
    render(<Tags {...argsShowMore} />)
  })

  it('renders WithoutLinks', () => {
    render(<Tags {...argsWithoutLinks} />)
  })

  it('renders with faulty tags', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(<Tags items={'tags' as any} />)
  })
})
