import { Field, useFormikContext } from 'formik'
import Input from '@shared/FormInput'
import React, { ReactElement, useEffect, useState } from 'react'
import styles from './Asset.module.css'
import Source from '@images/source.svg'
import { useUserPreferences } from '@context/UserPreferences'
import infoStyles from '../../@shared/FormInput/InputElement/FilesInput/Info.module.css'
import { SignalOriginItem } from '@context/Signals/_types'

const displayOptions = ['List View', 'Detail View']

export function Assets({
  handleRemoveSignal,
  handleSignalItemUpdate
}: {
  handleRemoveSignal(signalOrigin: SignalOriginItem): void
  handleSignalItemUpdate(
    signalOrigin: SignalOriginItem,
    signalOriginItemNew: SignalOriginItem
  ): void
}): ReactElement {
  const { values } = useFormikContext<any>()
  const { signals } = useUserPreferences()
  const getSignalPageViewOptions = () => {
    return (
      signals
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .filter((signal) => signal.type === values?.type)
        .map((signalOrigin: any, index: number) => {
          const uuidDetailView =
            signalOrigin.id + '_' + signalOrigin.detailView.id
          const uuidListView = signalOrigin.id + '_' + signalOrigin.listView.id
          return (
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
                        return handleRemoveSignal(signalOrigin)
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
                      id={uuidListView}
                      className={styles.displayCheck}
                      component={Input}
                      name={uuidListView}
                      options={[displayOptions[0]]}
                      onClick={(e) => {
                        e.preventDefault()
                        handleSignalItemUpdate(signalOrigin, {
                          ...signalOrigin,
                          [signalOrigin.listView.id]: {
                            ...signalOrigin.listView,
                            value: e.target.checked
                          }
                        })
                      }}
                    />
                    <Field
                      type="checkbox"
                      id={uuidDetailView}
                      className={styles.display}
                      component={Input}
                      name={uuidDetailView}
                      options={[displayOptions[1]]}
                      onClick={(e) => {
                        e.preventDefault()
                        handleSignalItemUpdate(signalOrigin, {
                          ...signalOrigin,
                          [signalOrigin.detailView.id]: {
                            ...signalOrigin.detailView,
                            value: e.target.checked
                          }
                        })
                      }}
                    />
                  </div>
                </div>
              </li>
            </>
          )
        })
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
