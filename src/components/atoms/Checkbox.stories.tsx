import React from 'react'
import Checkbox from './Checkbox'
import { Center } from '../../../.storybook/helpers'

export default {
  title: 'Atoms/Checkbox',
  decorators: [(storyFn: any) => <Center>{storyFn()}</Center>]
}

export const Checked = () => (
  <Checkbox
    name="someName"
    checked
    onChange={() => null}
    label="Example checkbox"
  />
)

export const Unchecked = () => (
  <Checkbox
    name="someName"
    checked={false}
    onChange={() => null}
    label="Example checkbox"
  />
)
