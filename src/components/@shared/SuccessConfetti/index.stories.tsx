import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import SuccessConfetti, { SuccessConfettiProps } from '@shared/SuccessConfetti'

export default {
  title: 'Component/@shared/SuccessConfetti',
  component: SuccessConfetti
} as ComponentMeta<typeof SuccessConfetti>

const Template: ComponentStory<typeof SuccessConfetti> = (
  args: SuccessConfettiProps
) => {
  return <SuccessConfetti {...args} />
}

interface Props {
  args: SuccessConfettiProps
}

export const Default: Props = Template.bind({})
Default.args = {
  success: 'Success'
}
