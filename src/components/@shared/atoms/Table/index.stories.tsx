import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Table, { TableProps } from '@shared/atoms/Table'

export default {
  title: 'Component/@shared/atoms/Table',
  component: Table
} as ComponentMeta<typeof Table>

const Template: ComponentStory<typeof Table> = (args) => <Table {...args} />

interface Props {
  args: TableProps
}

export const Default: Props = Template.bind({})
Default.args = {
  columns: [
    {
      name: 'Column 1 ',
      maxWidth: '45rem',
      grow: 1
    },
    {
      name: 'Column 2',
      maxWidth: '10rem'
    },
    {
      name: 'Column 3',
      right: true
    }
  ],
  data: []
}
