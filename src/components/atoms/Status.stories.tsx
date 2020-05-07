import React from 'react'
import Status from './Status'

export default {
  title: 'Atoms/Status'
}

export const Default = () => <Status />

export const Warning = () => <Status state="warning" />

export const Error = () => <Status state="error" />
