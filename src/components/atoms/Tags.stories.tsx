import React from 'react'
import Tags from './Tags'

const items = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6']

export default {
  title: 'Atoms/Tags'
}

export const Default = () => <Tags items={items} />

export const DefaultNoLinks = () => <Tags items={items} noLinks />

export const WithMaxItemsEq3 = () => <Tags items={items} max={3} />

export const WithMaxItemsEq3AndShowMore = () => (
  <Tags items={items} max={3} showMore />
)
