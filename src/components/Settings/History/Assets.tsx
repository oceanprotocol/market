import { Field, useFormikContext } from 'formik'
import Input from '@shared/FormInput'
import React, { ChangeEvent, ReactElement, useState } from 'react'
import { FormSettingsData } from '../_types'
import styles from './Asset.module.css'
import contentAsset from '../../../../content/settings/assets.json'
import Source from '@images/source.svg'
export function Assets({ assets }: { assets: any }): ReactElement {
  const { values } = useFormikContext<FormSettingsData>()
  const [checked, setChecked] = useState<boolean>()

  console.log('values', values)
  const items = Object.entries(contentAsset).map(([key, value], index) => (
    <>
      <>
        <li key={index}>
          <h3>{value.name}</h3>
          <p className={styles.assetDescription}>{value.description}</p>
          <div className={styles.displayBottom}>
            <div className={styles.displaySource}>
              <p>{value.status}</p>
              {value.status != null ? (
                <Source className={styles.sourceIcon} />
              ) : null}
            </div>

            <div className={styles.displaySignal}>
              <div className={styles.displaySignalText}>
                <p>{value.display}</p>
              </div>

              <Input
                type="checkbox"
                className={styles.displayCheck}
                name="Add custom signal"
                options={Object.values(value.options)}
                onChange={() => setChecked(!checked)}
              />
            </div>
          </div>
        </li>
      </>
    </>
  ))

  return <ol className={styles.assets}>{items}</ol>
}
