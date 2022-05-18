import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Table, { TableProps } from '@shared/atoms/Table'
import { AssetExtended } from 'src/@types/AssetExtended'
import Tooltip from '@shared/atoms/Tooltip'

export default {
  title: 'Component/@shared/atoms/Table',
  component: Table
} as ComponentMeta<typeof Table>

const Template: ComponentStory<typeof Table> = (args) => <Table {...args} />
//   const { chainIds } = useUserPreferences()
//   const columns = [
//     {
//       name: 'Column 1 ',
//       maxWidth: '45rem',
//       grow: 1
//     },
//     {
//       name: 'Column 2',
//       maxWidth: '10rem'
//     },
//     {
//       name: 'Column 3',
//       right: true
//     }
//   ]
//   const data: any[] = []

//   return (
//     <DataTable
//       {...args}
//       columns={columns}
//       data={data}
//       noDataComponent={<Empty message={'empty table'} />}
//     />
//   )

interface Props {
  args: TableProps
}

export const Default: Props = Template.bind({})
Default.args = {
  columns: [
    {
      name: 'Data Set',
      selector: function getAssetRow(row: AssetExtended) {
        const { metadata } = row
        return metadata.name
      },
      maxWidth: '45rem',
      grow: 1
    },
    {
      name: 'Datatoken Symbol',
      selector: function getAssetRow(row: AssetExtended) {
        return (
          <Tooltip content={row.datatokens[0].name}>
            {row.datatokens[0].symbol}
          </Tooltip>
        )
      },
      maxWidth: '10rem'
    },
    {
      name: 'Price',
      selector: function getAssetRow(row: AssetExtended) {
        return row.accessDetails.price
      },
      right: true
    }
  ],
  data: [
    {
      datatokens: [
        {
          name: 'DataAsset Token',
          symbol: 'DATA-70'
        }
      ],
      metadata: {
        name: 'Title asset'
      },
      accessDetails: {
        price: '1.011'
      }
    },
    {
      datatokens: [
        {
          name: 'DataAsset Token',
          symbol: 'DATA-71'
        }
      ],
      metadata: {
        name: 'Title asset'
      },
      accessDetails: {
        price: '2.011'
      }
    },
    {
      datatokens: [
        {
          name: 'DataAsset Token',
          symbol: 'DATA-80'
        }
      ],
      metadata: {
        name: 'Title asset'
      },
      accessDetails: {
        price: '3.011'
      }
    }
  ]
}
