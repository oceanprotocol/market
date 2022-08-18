import { Field, useFormikContext } from 'formik'
import Input from '@shared/FormInput'
import React, { ReactElement, useEffect, useState } from 'react'
import { FormSettingsData } from '../_types'
import { getFieldContent } from '../_utils'
import styles from './Asset.module.css'
import contentAsset from '../../../../content/settings/assets.json'
import Source from '@images/source.svg'
export function Assets({ assets }: { assets: any }): ReactElement {
import infoStyles from '../../@shared/FormFields/FilesInput/Info.module.css'
import { useUserPreferences } from '@context/UserPreferences'
const displayOptions = ['List View', 'Detail View']

export function Assets({ handleRemoveSignal }: { handleRemoveSignal(id: string): void }): ReactElement {
  const { values } = useFormikContext<FormSettingsData>()
  const { signals } = useUserPreferences()
  console.log('values', values)
  const getSignalPageViewOptions = () => {
    return signals.map((signalOrigin, index) => (
        <>
          <>
            <li key={signalOrigin.id}>
              <h3>{signalOrigin.title}</h3>
              {signalOrigin.isCustom && (
                  <button
                      className={infoStyles.removeButton}
                      style={{ position: 'relative', display: 'flex' }}
                      onClick={(e) => {
                        e.preventDefault()
                        return handleRemoveSignal(signalOrigin.id)
                      }}
                  >
                    &times;
                  </button>
              )}
              <p className={styles.assetDescription}>{signalOrigin.description}</p>
              <div className={styles.displayBottom}>
                <div className={styles.displaySource}>
                  <a target="_blank" href={signalOrigin.origin} rel="noreferrer">
                    Source <Source className={styles.sourceIcon} />
                  </a>
                </div>
                <div className={styles.displaySignal}>
                  <div className={styles.displaySignalText}>
                    <p>Display in</p>
                  </div>
                  <Field
                      type="checkbox"
                      id={signalOrigin.id}
                      className={styles.displayCheck}
                      component={Input}
                      name={signalOrigin.id + signalOrigin.listView.id}
                      options={[displayOptions[0]]}
                  />
                  <Field
                      type="checkbox"
                      id={signalOrigin.id}
                      className={styles.display}
                      component={Input}
                      name={signalOrigin.id + signalOrigin.detailView.id}
                      options={[displayOptions[1]]}
                  />
                </div>
              </div>
            </li>
          </>
        </>
    ))
  }
  const [settingsInputs, setSettingsInputs] = useState(
      getSignalPageViewOptions()
  )
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setSettingsInputs(getSignalPageViewOptions())
  }, [signals])

  return <ol className={styles.assets}>{settingsInputs}</ol>
}
