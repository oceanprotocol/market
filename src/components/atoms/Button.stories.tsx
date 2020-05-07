import React from 'react'
import Button from './Button'
import { Center } from '../../../.storybook/helpers'

export default {
  title: 'Atoms/Button',
  decorators: [(storyFn: any) => <Center>{storyFn()}</Center>]
}

export const Normal = () => <Button>Hello Button</Button>

export const Primary = () => <Button primary>Hello Button</Button>

export const Link = () => <Button link>Hello Button</Button>
