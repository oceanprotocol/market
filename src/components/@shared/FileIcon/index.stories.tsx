import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import FileIcon, { FileIconProps } from '@shared/FileIcon'
import { FileMetadata } from '@oceanprotocol/lib'

export default {
  title: 'Component/@shared/FileIcon',
  component: FileIcon
} as ComponentMeta<typeof FileIcon>

const Template: ComponentStory<typeof FileIcon> = (args: FileIconProps) => (
  <FileIcon {...args} />
)

interface Props {
  args: FileIconProps
}

const textFile = {
  contentLength: '750',
  contentType: 'text/html',
  index: 0,
  valid: true
}

export const Default: Props = Template.bind({})
Default.args = {
  file: textFile as FileMetadata
}

export const Small: Props = Template.bind({})
Small.args = {
  file: textFile as FileMetadata,
  small: true
}

export const IsLoading: Props = Template.bind({})
IsLoading.args = {
  file: textFile as FileMetadata,
  isLoading: true
}
