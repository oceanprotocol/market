import { render } from '@testing-library/react'
import React from 'react'
import { ListItem } from './index'
import { items } from './index.stories'

describe('Lists', () => {
  it('renders unordered', () => {
    render(
      <ul>
        {items.map((item, key) => (
          <ListItem key={key}>{item}</ListItem>
        ))}
      </ul>
    )
  })

  it('renders ordered', () => {
    render(
      <ol>
        {items.map((item, key) => (
          <ListItem ol key={key}>
            {item}
          </ListItem>
        ))}
      </ol>
    )
  })
})
