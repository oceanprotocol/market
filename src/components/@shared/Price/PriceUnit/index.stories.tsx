import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import PriceUnit, { PriceUnitProps } from '@shared/Price/PriceUnit'
import {
  locale,
  currency,
  prices
} from '../../../../../.storybook/__mockdata__'

export default {
  title: 'Component/@shared/Price/PriceUnit',
  component: PriceUnit
} as ComponentMeta<typeof PriceUnit>

const Template: ComponentStory<typeof PriceUnit> = (args: PriceUnitProps) => {
  return <PriceUnit {...args} />
}

interface Props {
  args: PriceUnitProps
}

export const Default: Props = Template.bind({})
Default.args = {
  price: '11.12333',
  locale,
  currency,
  prices
}
