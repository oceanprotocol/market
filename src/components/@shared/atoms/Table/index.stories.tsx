import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Table, { TableOceanProps } from '@shared/atoms/Table'
import { args, argsEmpty, argsLoading, argsWithPagination } from './index.test'

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
