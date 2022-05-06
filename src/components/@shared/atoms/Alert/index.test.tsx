import React from 'react'
import { render, screen } from '@testing-library/react'
import { composeStory } from '@storybook/testing-react'
import Meta, { Primary as PrimaryStory } from './index.stories'

const Primary = composeStory(PrimaryStory, Meta)

test('test against args', async () => {
  render(<Primary />)
  const alertElement = await screen.findByText('Alert text')
  expect(alertElement.textContent).toEqual(Primary.args.text)
})
