import { render } from '@testing-library/react'
import React from 'react'
import { TippyProps } from '@tippyjs/react'
import Tooltip from '.'

export const args: TippyProps = {
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquam facilisis molestie.'
}

export const argsWithContentOpened: TippyProps = {
  content: args.content,
  showOnCreate: true
}

export const argsWithCustomTriggerElement: TippyProps = {
  content: args.content,
  children: <a>Tooltip trigger</a>
}

export const argsWithCustomTriggerEvent: TippyProps = {
  content: args.content,
  children: <button>Click here</button>,
  trigger: 'on click'
}

export const argsDisabled: TippyProps = {
  content: args.content,
  children: <a>Tooltip disabled</a>,
  disabled: true
}

describe('Tooltip', () => {
  it('renders without crashing', () => {
    render(<Tooltip {...args} />)
  })

  it('renders WithContentOpened', () => {
    render(<Tooltip {...argsWithContentOpened} />)
  })

  it('renders WithCustomTriggerElement', () => {
    render(<Tooltip {...argsWithCustomTriggerElement} />)
  })

  it('renders WithCustomTriggerEvent', () => {
    render(<Tooltip {...argsWithCustomTriggerEvent} />)
  })

  it('renders Disabled', () => {
    render(<Tooltip {...argsDisabled} />)
  })
})
