import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Pagination from '@shared/Pagination'
import { PaginationProps } from './_types'
import MarketMetadataProvider from '@context/MarketMetadata'

export default {
  title: 'Component/@shared/Pagination',
  component: Pagination
} as ComponentMeta<typeof Pagination>

const Template: ComponentStory<typeof Pagination> = (args: PaginationProps) => {
  return (
    <MarketMetadataProvider>
      <Pagination {...args} />
    </MarketMetadataProvider>
  )
}

interface Props {
  args: PaginationProps
}

export const Default: Props = Template.bind({})
Default.args = {
  totalPages: 10,
  currentPage: 1,
  rowsPerPage: 3
}
