import { render } from '@testing-library/react'
import React from 'react'
import Tags, { TagsProps } from '.'

export const args: TagsProps = {
  items: [' tag1 ', ' tag2 ', ' tag3 '],
  className: 'custom-class'
}

export const argsMaxNumberOfTags: TagsProps = {
  items: [' tag1 ', ' tag2 ', ' tag3 '],
  max: 2
}

export const argsShowMore: TagsProps = {
  items: [' tag1 ', ' tag2 ', ' tag3 '],
  max: 2,
  showMore: true
}

export const argsWithoutLinks: TagsProps = {
  items: [' tag1 ', ' tag2 ', ' tag3 '],
  noLinks: true
}

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
})
