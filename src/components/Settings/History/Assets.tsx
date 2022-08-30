import { Field, useFormikContext } from 'formik'
import Input from '@shared/FormInput'
import React, { ReactElement, useEffect, useState } from 'react'
import { FormSettingsData } from '../_types'
import styles from './Asset.module.css'
import Source from '@images/source.svg'
import { useUserPreferences } from '@context/UserPreferences'
import infoStyles from '../../@shared/FormFields/FilesInput/Info.module.css'

const displayOptions = ['List View', 'Detail View']

export function Assets({
  handleRemoveSignal
}: {
  handleRemoveSignal(id: string): void
}): ReactElement {
  const { values } = useFormikContext<FormSettingsData>()
  const { signals } = useUserPreferences()
  const [checked, setChecked] = useState<boolean>()
  const getSignalPageViewOptions = () => {
    return (
      signals
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .filter((signal) => signal.type === values?.type)
        .map((signalOrigin: any, index: number) => (
          <>
            <>
              <li key={signalOrigin.id}>
                <div className={styles.displaySignalTitleContainer}>
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
                <p className={styles.assetDescription}>
                  {signalOrigin.description}
                </p>
                <div className={styles.displayBottom}>
                  <div className={styles.displaySource}>
                    Source{' '}
                    <a
                      target="_blank"
                      href={signalOrigin.origin}
                      rel="noreferrer"
                    >
                      <Source className={styles.sourceIcon} />
                    </a>{' '}
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
    )
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
