import { render } from '@testing-library/react'
import React from 'react'
import Tooltip from '.'
import {
  props,
  propsWithContentOpened,
  propsWithCustomTriggerElement,
  propsWithCustomTriggerEvent,
  propsDisabled
} from './index.stories'

describe('Tooltip', () => {
  it('renders without crashing', () => {
    render(<Tooltip {...props} />)
  })

  it('renders WithContentOpened', () => {
    render(<Tooltip {...propsWithContentOpened} />)
  })

  it('renders WithCustomTriggerElement', () => {
    render(<Tooltip {...propsWithCustomTriggerElement} />)
  })

  it('renders WithCustomTriggerEvent', () => {
    render(<Tooltip {...propsWithCustomTriggerEvent} />)
  })

  it('renders Disabled', () => {
    render(<Tooltip {...propsDisabled} />)
  })
})
