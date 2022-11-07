import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Table, { TableOceanProps } from '@shared/atoms/Table'
import { columns, data } from '../../../../../.jest/__fixtures__/table'

export const args: TableOceanProps<any> = { columns, data }

export const argsWithPagination: TableOceanProps<any> = {
  columns,
  data: data.flatMap((i) => [i, i, i])
}

export const argsLoading: TableOceanProps<any> = {
  isLoading: true,
  columns: [],
  data: []
}

export const argsEmpty: TableOceanProps<any> = {
  emptyMessage: 'I am empty',
  columns: [],
  data: []
}

export default {
  title: 'Component/@shared/atoms/Table',
  component: Table
} as ComponentMeta<typeof Table>

const Template: ComponentStory<typeof Table> = (args) => <Table {...args} />

interface Props {
  args: TableOceanProps<any>
}

export const WithData: Props = Template.bind({})
WithData.args = args

export const WithPagination: Props = Template.bind({})
WithPagination.args = argsWithPagination

export const Loading: Props = Template.bind({})
Loading.args = argsLoading

export const Empty: Props = Template.bind({})
Empty.args = argsEmpty
