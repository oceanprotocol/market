import React from 'react'
import { Center } from '../../../.storybook/helpers'
import { Alert } from './Alert'

export default {
  title: 'Atoms/Alert',
  decorators: [(storyFn: any) => <Center>{storyFn()}</Center>]
}

export const Error = () => (
  <Alert title="Title" text="I am the alert text." state="error" />
)

export const Warning = () => (
  <Alert title="Title" text="I am the alert text." state="warning" />
)

export const Info = () => (
  <Alert title="Title" text="I am the alert text." state="info" />
)

export const Success = () => (
  <Alert title="Title" text="I am the alert text." state="success" />
)
