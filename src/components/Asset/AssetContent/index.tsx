import React, { ReactElement, useEffect, useState } from 'react'
import { useWeb3 } from '@context/Web3'
import Markdown from '@shared/Markdown'
import MetaFull from './MetaFull'
import MetaSecondary from './MetaSecondary'
import AssetActions from '../AssetActions'
import { useUserPreferences } from '@context/UserPreferences'
import Bookmark from './Bookmark'
import { useAsset } from '@context/Asset'
import Alert from '@shared/atoms/Alert'
import DebugOutput from '@shared/DebugOutput'
import MetaMain from './MetaMain'
import EditHistory from './EditHistory'
import styles from './index.module.css'
import NetworkName from '@shared/NetworkName'
import content from '../../../../content/purgatory.json'
import { AssetExtended } from 'src/@types/AssetExtended'
import Button from '@shared/atoms/Button'
import { getServiceById, getServiceByName } from '@utils/ddo'
import EditComputeDataset from '../Edit/EditComputeDataset'

export default function AssetContent({
  asset
}: {
  asset: AssetExtended
}): ReactElement {
  const { accountId } = useWeb3()
  const { debug } = useUserPreferences()
  const { owner, isInPurgatory, purgatoryData, isAssetNetwork } = useAsset()
  const [isOwner, setIsOwner] = useState(false)
  const [isComputeType, setIsComputeType] = useState<boolean>(false)
  const [showEditCompute, setShowEditCompute] = useState<boolean>()

  useEffect(() => {
    if (!accountId || !owner) return

    const isOwner = accountId.toLowerCase() === owner.toLowerCase()
    setIsOwner(isOwner)
    // setShowPricing(isOwner && price.type === '')
    setIsComputeType(Boolean(getServiceByName(asset, 'compute')))
  }, [accountId, asset?.accessDetails, owner, asset])

  function handleEditComputeButton() {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    setShowEditCompute(true)
  }

  // return showEditCompute ? (
  //   <EditComputeDataset setShowEdit={setShowEditCompute} />
  // ) : (
  return (
    <>
      <div className={styles.networkWrap}>
        <NetworkName networkId={asset?.chainId} className={styles.network} />
      </div>

      <article className={styles.grid}>
        <div>
          <div className={styles.content}>
            <MetaMain ddo={asset} />
            {asset?.accessDetails?.datatoken !== null && (
              <Bookmark did={asset?.id} />
            )}

            {isInPurgatory === true ? (
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
                  text={asset?.metadata.description || ''}
                />
                <MetaSecondary ddo={asset} />
              </>
            )}

            <MetaFull ddo={asset} />
            <EditHistory />
            {debug === true && <DebugOutput title="DDO" output={asset} />}
          </div>
        </div>

        <div className={styles.actions}>
          <AssetActions asset={asset} />

          {/* 
            TODO: restore edit actions, ideally put edit screens on new page 
            with own URL instead of switching out AssetContent in place. 
            Simple way would be modal usage 
          */}
          {isOwner && isAssetNetwork && (
            <div className={styles.ownerActions}>
              {/* <Button
                style="text"
                size="small"
                onClick={handleEditComputeButton}
              >
                Edit Metadata
              </Button> */}
              {isComputeType && asset.metadata.type === 'dataset' && (
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
        </div>
      </article>
    </>
  )
}
