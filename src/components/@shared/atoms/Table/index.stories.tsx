import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Table, { TableOceanProps } from '@shared/atoms/Table'

export default {
  title: 'Component/@shared/atoms/Table',
  component: Table
} as ComponentMeta<typeof Table>

const Template: ComponentStory<typeof Table> = (args) => <Table {...args} />

interface Props {
  args: TableOceanProps<any>
}

const columns = [
  {
    name: 'Name',
    selector: (row: any) => row.name,
    maxWidth: '45rem',
    grow: 1
  },
  {
    name: 'Symbol',
    selector: (row: any) => row.symbol,
    maxWidth: '10rem'
  },
  {
    name: 'Price',
    selector: (row: any) => row.price,
    right: true
  }
]

const data = [
  {
    name: 'Title asset',
    symbol: 'DATA-70',
    price: '1.011'
  },
  {
    name: 'Title asset Title asset Title asset Title asset Title asset',
    symbol: 'DATA-71',
    price: '1.011'
  },
  {
    name: 'Title asset',
    symbol: 'DATA-72',
    price: '1.011'
  },
  {
    name: 'Title asset Title asset Title asset Title asset Title asset Title asset Title asset Title asset Title asset Title asset',
    symbol: 'DATA-71',
    price: '1.011'
  }
]

export const WithData: Props = Template.bind({})
WithData.args = {
  columns,
  data
}

export const WithPagination: Props = Template.bind({})
WithPagination.args = {
  columns,
  data: data.flatMap((i) => [i, i, i])
}

export const Loading: Props = Template.bind({})
Loading.args = {
  isLoading: true,
  columns: [],
  data: []
}

export const Empty: Props = Template.bind({})
Empty.args = {
  emptyMessage: 'I am empty',
  columns: [],
  data: []
}
