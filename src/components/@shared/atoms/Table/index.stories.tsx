import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Table, { TableProps } from '@shared/atoms/Table'

export default {
  title: 'Component/@shared/atoms/Table',
  component: Table
} as ComponentMeta<typeof Table>

const Template: ComponentStory<typeof Table> = (args: TableProps) => (
  <Table {...args} />
)

interface Props {
  args: {
    columns: any
    data: string[]
    isLoading: boolean
    emptyMessage: string
  }
}

export const Primary: Props = Template.bind({})
Primary.args = {
  columns: [
    {
      name: 'Column 1'
    },
    {
      name: 'Column 2'
    }
  ],
  data: [
    '{column1: column1, column2: column2}',
    '{column1: column1, column2: column2}'
  ],
  isLoading: true,
  emptyMessage: 'Table unit test'
}
