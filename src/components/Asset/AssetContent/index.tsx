import React, { ReactElement, useEffect, useState } from 'react'
import Markdown from '@shared/Markdown'
import MetaFull from './MetaFull'
import MetaSecondary from './MetaSecondary'
import AssetActions from '../AssetActions'
import { useUserPreferences } from '@context/UserPreferences'
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
import content from '../../../../content/purgatory.json'

export default function AssetContent({ ddo }: { ddo: Asset }): ReactElement {
  const { debug } = useUserPreferences()
  const { accountId } = useWeb3()
  const { price, owner, isInPurgatory, purgatoryData, isAssetNetwork } =
    useAsset()
  const [showEdit, setShowEdit] = useState<boolean>()
  const [isComputeType, setIsComputeType] = useState<boolean>(false)
  const [showEditCompute, setShowEditCompute] = useState<boolean>()
  const [isOwner, setIsOwner] = useState(false)

  const serviceCompute = ddo.services.filter(
    (service) => service.type === 'compute'
  )[0]

  useEffect(() => {
    if (!accountId || !owner) return

    const isOwner = accountId.toLowerCase() === owner.toLowerCase()
    setIsOwner(isOwner)
    setIsComputeType(Boolean(serviceCompute))
  }, [accountId, price, owner, ddo])

  function handleEditButton() {
    setShowEdit(true)
  }

  function handleEditComputeButton() {
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
                  text={ddo?.metadata.description || ''}
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
                    {serviceCompute && ddo?.metadata.type === 'dataset' && (
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
