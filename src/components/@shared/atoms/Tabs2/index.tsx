import React, { ReactElement, useState } from 'react'
import { Tabs as ReactTabs } from 'react-tabs'
import styles from './index.module.css'
import contentAsset from '../../../../../content/settings/assets.json'
import Arrow from '@images/arrow.svg'
import AlgorithmIcon from '@images/algorithm.svg'

export interface TabsProps {
  className?: string
  defaultIndex?: number
}

export default function Tabs2({
  className,
  defaultIndex
}: TabsProps): ReactElement {
  const [openUp, setOpenUp] = useState(false)

  const itemsClose = (index: any) =>
    Object.entries(contentAsset).map(([key, value], index) => (
      <>
        <>
          {value.name.length > 0 ? (
            <li key={index}>
              <div className={styles.assetListTitle}>
                <div className={styles.assetListTitleName}>
                  <AlgorithmIcon className={styles.assetListIcon} />
                  <p> {value.name}</p>
                </div>
                <div className={styles.assetListTitleNumber}>
                  <p>{value.number}</p>
                </div>
              </div>
            </li>
          ) : null}
        </>
      </>
    ))

  const itemsOpen = (index: any) =>
    Object.entries(contentAsset).map(([key, value], index) => (
      <>
        <>
          {value.name.length > 0 ? (
            <li key={index}>
              <div className={styles.assetListTitle}>
                <div>
                  <p>
                    <AlgorithmIcon className={styles.assetListIcon} />
                  </p>
                  <p> {value.name} </p>
                </div>
                <div className={styles.assetListTitleNumber}>
                  {value.number}
                </div>
              </div>
              <p>{value.description}</p>
              <p>{value.source}</p>
            </li>
          ) : null}
        </>
      </>
    ))

  return (
    <>
      <ReactTabs className={`${className || ''}`} defaultIndex={defaultIndex}>
        <div className={styles.tab2Content}>
          <div className={styles.tab2ContentTitle}>
            <p>Asset Signal</p>
            <p className={styles.details}>
              {openUp ? 'HIDE DETAILS' : 'SHOW DETAILS'}
              <Arrow className={styles.tab2Icon} />
              <div
                onClick={() => {
                  setOpenUp(!openUp)
                }}
              ></div>
            </p>
          </div>
          <div>
            {' '}
            <ol className={styles.assets}>
              {openUp ? itemsOpen(!openUp) : itemsClose(!openUp)}
            </ol>
          </div>
        </div>
      </ReactTabs>
    </>
  )
}
