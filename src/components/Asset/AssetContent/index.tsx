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
import DebugOutput from '@shared/DebugOutput'
import MetaMain from './MetaMain'
import EditHistory from './EditHistory'
import { useWeb3 } from '@context/Web3'
import styles from './index.module.css'
import NetworkName from '@shared/NetworkName'
import content from '../../../../content/purgatory.json'

export default function AssetContent({
  ddo,
  isPreview
}: {
  ddo: Asset | DDO
  isPreview?: boolean
}): ReactElement {
  const { debug } = useUserPreferences()
  const { accountId } = useWeb3()
  const { price, owner, isInPurgatory, purgatoryData, isAssetNetwork } =
    useAsset()
  const [isOwner, setIsOwner] = useState(false)

  const serviceCompute = ddo?.services?.filter(
    (service) => service.type === 'compute'
  )[0]

  return (
    <>
      <div className={styles.networkWrap}>
        <NetworkName networkId={ddo?.chainId} className={styles.network} />
      </div>

      <article className={styles.grid}>
        <div>
          <div className={styles.content}>
            <MetaMain ddo={ddo} />
            {!isPreview && <Bookmark did={ddo?.id} />}

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
              </>
            )}

            <MetaFull ddo={ddo} />
            {!isPreview && <EditHistory />}
            {!isPreview && debug === true && (
              <DebugOutput title="DDO" output={ddo} />
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <AssetActions />

          {/* {isOwner && isAssetNetwork && (
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
          )} */}
        </div>
      </article>
    </>
  )
}
