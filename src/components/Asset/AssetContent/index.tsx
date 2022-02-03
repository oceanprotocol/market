import React, { ReactElement } from 'react'
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

export default function AssetContent({
  asset
}: {
  asset: AssetExtended
}): ReactElement {
  const { debug } = useUserPreferences()
  const { isInPurgatory, purgatoryData } = useAsset()

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
