import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Badge, { BadgeProps } from '@shared/atoms/Badge'

export default {
  title: 'Component/@shared/atoms/Badge',
  component: Badge
} as ComponentMeta<typeof Badge>

const Template: ComponentStory<typeof Badge> = (args) => <Badge {...args} />

interface Props {
  args: BadgeProps
}

export const Default: Props = Template.bind({})
Default.args = {
  label: 'Badge label'
}
