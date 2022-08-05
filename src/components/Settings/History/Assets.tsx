import { Field } from 'formik'
import Input from '@shared/FormInput'
import React, { ReactElement, useEffect, useState } from 'react'
import styles from './Asset.module.css'
import infoStyles from '../../@shared/FormFields/FilesInput/Info.module.css'
import { useUserPreferences } from '@context/UserPreferences'

const displayOptions = ['List View', 'Detail View']

export function Assets({
  handleRemoveSignal
}: {
  handleRemoveSignal(id: string): void
}): ReactElement {
  const { signals } = useUserPreferences()
  const getSignalPageViewOptions = () => {
    return signals.map((signalOrigin, index) => {
      return (
        <li key={signalOrigin.id}>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
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
          </div>
          <p>{signalOrigin.description}</p>
          <div className={styles.display}>
            <a target="_blank" href="#">
              Source
            </a>
            <div>
              <p>Display in</p>
              <Field
                type="checkbox"
                id={signalOrigin.id}
                className={styles.display}
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
      )
    })
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
