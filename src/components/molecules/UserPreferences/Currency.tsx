import React, { ReactElement, ChangeEvent } from 'react'
import { useUserPreferences } from '../../../providers/UserPreferences'
import Input from '../../atoms/Input'

export default function Currency(): ReactElement {
  const { currency, setCurrency } = useUserPreferences()

  return (
    <li>
      <Input
        name="currency"
        label="Currency"
        help="Select your preferred currency."
        type="select"
        options={['EUR', 'USD']}
        value={currency}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          setCurrency(e.target.value)
        }
        small
      />
    </li>
  )
}
