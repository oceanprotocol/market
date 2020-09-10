import React, { ReactElement, ChangeEvent } from 'react'
import { useUserPreferences } from '../../../providers/UserPreferences'
import Input from '../../atoms/Input'
import styles from './Preferencs.module.css'

export default function Preferences(): ReactElement {
  const { debug, setDebug, currency, setCurrency } = useUserPreferences()

  return (
    <ul className={styles.preferences}>
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
      <li>
        <Input
          name="debug"
          label="Debug Mode"
          help="Show geeky debug information in some places."
          type="checkbox"
          options={['Activate Debug Mode']}
          defaultChecked={debug === true}
          onChange={() => setDebug(!debug)}
        />
      </li>
    </ul>
  )
}
