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
          name="debug"
          label="Debug Mode"
          help="Activate to show geeky debug information in some places throughout the UI."
          type="checkbox"
          options={['Enable Debug Mode']}
          defaultChecked={debug === true}
          onChange={() => setDebug(!debug)}
        />
      </li>
      <li>
        <Input
          name="currency"
          label="Currency"
          help="Select your preferred currency."
          type="select"
          options={['eur', 'usd']}
          value={currency}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setCurrency(e.target.value)
          }
          small
        />
      </li>
    </ul>
  )
}
