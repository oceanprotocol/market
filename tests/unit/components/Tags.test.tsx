import React from 'react'
import { render } from '@testing-library/react'
import Tags from '../../../src/components/atoms/Tags'

const items = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6']

describe('Tags', () => {
  it('default renders correctly without crashing', () => {
    const { container } = render(<Tags items={items} />)
    expect(container.firstChild).toBeInTheDocument()

    const pills = container.querySelectorAll('a')
    expect(pills.length).toEqual(items.length)
  })

  it('Max attribute limits maximum number of pills shown', () => {
    const { container } = render(<Tags items={items} max={3} />)

    const pills = container.querySelectorAll('a')
    expect(pills.length).toEqual(3)
  })
})
