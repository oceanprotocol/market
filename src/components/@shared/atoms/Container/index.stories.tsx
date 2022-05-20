import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Container, { ContainerProps } from '@shared/atoms/Container'

export default {
  title: 'Component/@shared/atoms/Container',
  component: Container
} as ComponentMeta<typeof Container>

const Template: ComponentStory<typeof Container> = (args) => (
  <Container {...args} />
)

interface Props {
  args: ContainerProps
}

export const Default: Props = Template.bind({})
Default.args = {
  children: (
    <>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquam
      facilisis molestie. Integer eget congue turpis, in pharetra lectus. Sed
      urna dolor, porttitor luctus mauris eget, lacinia consectetur eros. Duis
      consequat, turpis et porttitor cursus, ante lacus placerat arcu, vel
      pellentesque enim orci ac sem.
    </>
  )
}

export const Narrow: Props = Template.bind({})
Narrow.args = {
  children: (
    <>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquam
      facilisis molestie. Integer eget congue turpis, in pharetra lectus. Sed
      urna dolor, porttitor luctus mauris eget, lacinia consectetur eros. Duis
      consequat, turpis et porttitor cursus, ante lacus placerat arcu, vel
      pellentesque enim orci ac sem.
    </>
  ),
  narrow: true
}
