import React, { ReactNode } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Container from '@shared/atoms/Container'
import styles from './index.module.css'

export default {
  title: 'Component/@shared/atoms/Container',
  component: Container
} as ComponentMeta<typeof Container>

const Template: ComponentStory<typeof Container> = (args) => (
  <Container {...args} />
)

interface Props {
  args: {
    narrow: boolean
    children: ReactNode
    className: string
  }
}

export const Primary: Props = Template.bind({})
Primary.args = {
  narrow: true,
  children: (
    <>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{
          __html:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquam facilisis molestie. Integer eget congue turpis, in pharetra lectus. Sed urna dolor, porttitor luctus mauris eget, lacinia consectetur eros. Duis consequat, turpis et porttitor cursus, ante lacus placerat arcu, vel pellentesque enim orci ac sem.'
        }}
      />
    </>
  ),
  className: styles.container || 'className'
}
