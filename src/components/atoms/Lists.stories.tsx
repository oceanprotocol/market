import React from 'react'
import { ListItem } from './Lists'

export default {
  title: 'Atoms/Lists'
}

export const Unordered = () => (
  <ul>
    <ListItem>Hello You</ListItem>
    <ListItem>Hello You</ListItem>
    <ListItem>Hello You</ListItem>
  </ul>
)

export const Ordered = () => (
  <ol>
    <ListItem ol>Hello You</ListItem>
    <ListItem ol>Hello You</ListItem>
    <ListItem ol>Hello You</ListItem>
  </ol>
)
