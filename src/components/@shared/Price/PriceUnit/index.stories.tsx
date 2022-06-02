import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import PriceUnit, { PriceUnitProps } from '@shared/Price/PriceUnit'
import { useUserPreferences } from '@context/UserPreferences'

export default {
  title: 'Component/@shared/Price/PriceUnit',
  component: PriceUnit
} as ComponentMeta<typeof PriceUnit>

const Template: ComponentStory<typeof PriceUnit> = (args: PriceUnitProps) => {
  const { locale } = useUserPreferences()

  if (!locale) return
  return <PriceUnit {...args} />
}

interface Props {
  args: PriceUnitProps
}

export const Default: Props = Template.bind({})
Default.args = {
  price: '11.12333'
}
