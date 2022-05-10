import React from 'react'
import { render, screen } from '@testing-library/react'
import { composeStory } from '@storybook/testing-react'
import Meta, { Primary as PrimaryStory } from './index.stories'

// Returns a component that already contain all decorators from story level, meta level and global level.
const Primary = composeStory(PrimaryStory, Meta)

test('onclick handler is called', () => {
  render(<Primary />)
  const buttonElement = screen.getByRole('button')
  buttonElement.click()
})

test('test against args', () => {
  render(<Primary />)
  const buttonElement = screen.getByRole('button')
  // Testing against values coming from the story itself! No need for duplication
  expect(buttonElement.textContent).toEqual(Primary.args.children)
})
