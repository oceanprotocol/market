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

const file = {
  contentLength: '0',
  contentType: 'text/html',
  index: 0,
  valid: true
}

export const Default: Props = Template.bind({})
Default.args = {
  file: file as FileMetadata
}
