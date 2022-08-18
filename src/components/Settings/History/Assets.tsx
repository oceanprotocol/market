import { Field, useFormikContext } from 'formik'
import Input from '@shared/FormInput'
import React, { ReactElement } from 'react'
import { FormSettingsData } from '../_types'
import { getFieldContent } from '../_utils'
import styles from './Asset.module.css'
import contentAsset from '../../../../content/settings/assets.json'
import Source from '@images/source.svg'
export function Assets({ assets }: { assets: any }): ReactElement {
  const { values } = useFormikContext<FormSettingsData>()

  console.log('values', values)
  const items = Object.entries(contentAsset).map(([key, value], index) => (
    <>
      <>
        <li key={index}>
          <h3>{value.name}</h3>
          <p className={styles.assetDescription}>{value.description}</p>
          <div className={styles.display}>
            <div className={styles.sourceDisplay}>
              <p>{value.status}</p>
              {value.status != null ? (
                <Source className={styles.sourceIcon} />
              ) : null}
            </div>

            <div className={styles.displaySignal}>
              <div>
                <p>{value.display}</p>
              </div>

              <Field
                type="checkbox"
                className={styles.display}
                {...getFieldContent('type', [])}
                component={Input}
                name="Add custom signal"
                options={Object.values(value.options)}
              />
            </div>
          </div>
        </li>
      </>
    </>
  ))

  return <ol className={styles.assets}>{items}</ol>
}
