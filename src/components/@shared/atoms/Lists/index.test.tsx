import { render } from '@testing-library/react'
import React from 'react'
import { ListItem } from './index'

export const items = [
  'List item short',
  'List item long ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquam facilisis molestie',
  'List item long ipsum dolor sit amet, consectetur adipiscing elit',
  'List item short',
  'List item long ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquam facilisis molestie',
  'List item long ipsum dolor sit amet, consectetur adipiscing elit'
]

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
