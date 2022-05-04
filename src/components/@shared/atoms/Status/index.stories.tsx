import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Status from '@shared/atoms/Status/index'
import styles from './index.module.css'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Component/@shared/atoms/Status',
  component: Status
} as ComponentMeta<typeof Status>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Status> = (args) => <Status {...args} />

interface Props {
  args: {
    state: string
    className: string
  }
}

export const Primary: Props = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  state: 'state',
  className: styles.status || 'className'
}
