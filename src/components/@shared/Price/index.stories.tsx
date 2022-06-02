import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Price, { PriceProps } from '@shared/Price'
import { AccessDetails } from 'src/@types/Price'

export default {
  title: 'Component/@shared/Price',
  component: Price
} as ComponentMeta<typeof Price>

const Template: ComponentStory<typeof Price> = (args: PriceProps) => (
  <Price {...args} />
)

interface Props {
  args: PriceProps
}

const accessDetailsData = {
  type: 'dynamic',
  price: '11.12333',
  addressOrId: '0x32ddc4852ab7bd751d05b44db6f15841f93b4dde',
  baseToken: {
    address: '0x8967bcf84170c91b0d24d4302c2376283b0b3a07',
    name: 'OceanToken',
    symbol: 'OCEAN'
  },
  datatoken: {
    address: '0xf76433efb64bd4ff619a127b405dfb66e062356b',
    name: 'Puckish Porpoise Token',
    symbol: 'PUCPOR-86'
  },
  isPurchasable: true,
  isOwned: true,
  validOrderTx:
    '0x34822bb79ec9f08b7b22a371a752a050bc130dbbb032e89f4c16b644862b6bf9',
  publisherMarketOrderFee: '0xxx'
}

export const Default: Props = Template.bind({})
Default.args = {
  accessDetails: accessDetailsData as AccessDetails
}
