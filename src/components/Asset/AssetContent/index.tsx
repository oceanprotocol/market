import React, { ReactElement, useEffect, useState } from 'react'
import Markdown from '@shared/Markdown'
import MetaFull from './MetaFull'
import MetaSecondary from './MetaSecondary'
import AssetActions from '../AssetActions'
import { useUserPreferences } from '@context/UserPreferences'
import Pricing from '../../Publish/Pricing'
import Bookmark from './Bookmark'
import { useAsset } from '@context/Asset'
import Alert from '@shared/atoms/Alert'
import Button from '@shared/atoms/Button'
import Edit from '../AssetActions/Edit'
import EditComputeDataset from '../AssetActions/Edit/EditComputeDataset'
import DebugOutput from '@shared/DebugOutput'
import MetaMain from './MetaMain'
import EditHistory from './EditHistory'
import { useWeb3 } from '@context/Web3'
import styles from './index.module.css'
import NetworkName from '@shared/NetworkName'
import NetworkName from '@shared/atoms/NetworkName'

export interface AssetContentProps {
  path?: string
}

const contentQuery = graphql`
  query AssetContentQuery {
import content from '../../../../content/purgatory.json'

export default function AssetContent(): ReactElement {
  const { debug } = useUserPreferences()
  const { accountId } = useWeb3()
  const { owner, isInPurgatory, purgatoryData, isAssetNetwork } = useAsset()
  const [showPricing, setShowPricing] = useState(false)
  const [showEdit, setShowEdit] = useState<boolean>()
  const [isComputeType, setIsComputeType] = useState<boolean>(false)
  const [showEditCompute, setShowEditCompute] = useState<boolean>()
  const [isOwner, setIsOwner] = useState(false)
  const { ddo, price, metadata, type } = useAsset()

  useEffect(() => {
    if (!accountId || !owner) return

    const isOwner = accountId.toLowerCase() === owner.toLowerCase()
    setIsOwner(isOwner)
    setShowPricing(isOwner && price.type === '')
    setIsComputeType(Boolean(ddo.findServiceByType('compute')))
  }, [accountId, price, owner, ddo])

  function handleEditButton() {
    // move user's focus to top of screen
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    setShowEdit(true)
  }

  function handleEditComputeButton() {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    setShowEditCompute(true)
  }

  return showEdit ? (
    <Edit setShowEdit={setShowEdit} isComputeType={isComputeType} />
  ) : showEditCompute ? (
    <EditComputeDataset setShowEdit={setShowEditCompute} />
  ) : (
    <>
      <div className={styles.networkWrap}>
        <NetworkName networkId={ddo.chainId} className={styles.network} />
      </div>

      <article className={styles.grid}>
        <div>
          {showPricing && <Pricing ddo={ddo} />}
          <div className={styles.content}>
            <MetaMain />
            <Bookmark did={ddo.id} />

            {isInPurgatory ? (
              <Alert
                title={content.asset.title}
                badge={`Reason: ${purgatoryData?.reason}`}
                text={content.asset.description}
                state="error"
              />
            ) : (
              <>
                <Markdown
                  className={styles.description}
                  text={metadata?.additionalInformation?.description || ''}
                />

                <MetaSecondary />

                {isOwner && isAssetNetwork && (
                  <div className={styles.ownerActions}>
                    <Button
                      style="text"
                      size="small"
                      onClick={handleEditButton}
                    >
                      Edit Metadata
                    </Button>
                    {ddo.findServiceByType('compute') && type === 'dataset' && (
                      <>
                        <span className={styles.separator}>|</span>
                        <Button
                          style="text"
                          size="small"
                          onClick={handleEditComputeButton}
                        >
                          Edit Compute Settings
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </>
            )}

            <MetaFull />
            <EditHistory />
            {debug === true && <DebugOutput title="DDO" output={ddo} />}
          </div>
        </div>

        <div className={styles.actions}>
          <AssetActions />
        </div>
      </article>
    </>
  )
}
