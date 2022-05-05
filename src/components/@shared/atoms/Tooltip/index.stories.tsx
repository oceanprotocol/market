import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Tooltip from '@shared/atoms/Tooltip'
import Tippy from '@tippyjs/react'
import { animated } from 'react-spring'
import styles from './index.module.css'

export default {
  title: 'Component/@shared/atoms/Tooltip',
  component: Tooltip
} as ComponentMeta<typeof Tooltip>

// jest.setTimeout(300000)

const Template: ComponentStory<typeof Tooltip> = (args) => (
  <Tooltip {...args}>
    <Tippy
      render={(attrs: any) => (
        <animated.div>
          <div className={styles.content} {...attrs}>
            {args.content}
            <div className={styles.arrow} data-popper-arrow />
          </div>
        </animated.div>
      )}
    />
  </Tooltip>
)
interface Props {
  args: {
    content: string
    trigger?: string
    disabled?: boolean
  }
}

export const Primary: Props = Template.bind({})
Primary.args = {
  content: 'Toltip test content',
  trigger: 'tooltip trigger',
  disabled: true
}
