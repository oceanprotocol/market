import React from 'react'
import Loader from './Loader'
import { Center } from '../../../.storybook/helpers'

export default {
  title: 'Atoms/Loader',
  decorators: [(storyFn: any) => <Center>{storyFn()}</Center>]
}

export const Normal = () => <Loader />

export const WithMessage = () => (
  <Loader message="Crunching all the tech for you..." />
)

export const WithMessageHorizontal = () => (
  <Loader message="Crunching all the tech for you..." isHorizontal />
)
