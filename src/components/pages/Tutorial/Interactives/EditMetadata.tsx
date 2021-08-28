import styles from '../index.module.css'
import React from 'react'
import { ReactElement } from 'react-markdown'
import EditComputeDataset from '../../../organisms/AssetActions/Edit/EditComputeDataset'
import Page from '../../../templates/Page'
import PageTemplateAssetDetails from '../../../templates/PageAssetDetails'
import { useAsset } from '../../../../providers/Asset'

export default function Chapter9({
  showPriceTutorial,
  showComputeTutorial,
  setShowComputeTutorial
}: {
  showPriceTutorial: boolean
  showComputeTutorial: boolean
  setShowComputeTutorial: (value: boolean) => void
}): ReactElement {
  const { ddo } = useAsset()
  return (
    <>
      {ddo && showPriceTutorial && (
        <>
          {!showComputeTutorial && (
            <Page
              title="Choose the algorithm here"
              description="Only selected algorithms are allowed to run on this data set. Updating these settings will create an on-chain transaction you have to approve in your wallet."
              uri="/tutorial"
            >
              <div className={styles.compute}>
                <EditComputeDataset
                  tutorial
                  setShowEdit={setShowComputeTutorial}
                />
              </div>
            </Page>
          )}
          {showComputeTutorial && (
            <PageTemplateAssetDetails
              uri={`/tutorial/${ddo.id}`}
              setShowComputeTutorial={setShowComputeTutorial}
            />
          )}
        </>
      )}
    </>
  )
}
