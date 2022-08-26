import React, { ReactElement, ChangeEvent } from 'react'
import { useUserPreferences } from '@context/UserPreferences'
import Input from '@shared/FormInput'
import { useMarketMetadata } from '@context/MarketMetadata'
import styles from './index.module.css'
import Label from '@shared/FormInput/Label'

export default function Currency({
  textVisible
}: {
  textVisible: boolean
}): ReactElement {
  const { currency, setCurrency } = useUserPreferences()
  const { appConfig } = useMarketMetadata()

  return (
    <li>
      {/* <Label htmlFor="">Currency</Label> */}
      <Input
        name="currency"
        label="Currency"
        help="Your conversion display currency."
        type="select"
        options={appConfig?.currencies}
        value={currency}
        textVisible={textVisible}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          setCurrency(e.target.value)
        }
        size="small"
      />
    </li>
  )
}
