import React, { ReactElement, useEffect, useState } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import Markdown from '../../atoms/Markdown'
import MetaFull from './MetaFull'
import MetaSecondary from './MetaSecondary'
import AssetActions from '../AssetActions'
import { useUserPreferences } from '../../../providers/UserPreferences'
import Pricing from './Pricing'
import Bookmark from './Bookmark'
import { useAsset } from '../../../providers/Asset'
import Alert from '../../atoms/Alert'
import Button from '../../atoms/Button'
import Edit from '../AssetActions/Edit'
import EditComputeDataset from '../AssetActions/Edit/EditComputeDataset'
import DebugOutput from '../../atoms/DebugOutput'
import MetaMain from './MetaMain'
import EditHistory from './EditHistory'
import { useWeb3 } from '../../../providers/Web3'
import styles from './index.module.css'

export interface AssetContentProps {
  path?: string
}

const contentQuery = graphql`
  query AssetContentQuery {
    purgatory: allFile(filter: { relativePath: { eq: "purgatory.json" } }) {
      edges {
        node {
          childContentJson {
            asset {
              title
              description
            }
          }
        }
      }
    }
  }
`

export default function AssetContent(props: AssetContentProps): ReactElement {
  const data = useStaticQuery(contentQuery)
  const content = data.purgatory.edges[0].node.childContentJson.asset
  const { debug } = useUserPreferences()
  const { accountId } = useWeb3()
  const { owner, isInPurgatory, purgatoryData } = useAsset()
  const [showPricing, setShowPricing] = useState(false)
  const [showEdit, setShowEdit] = useState<boolean>()
  const [showEditCompute, setShowEditCompute] = useState<boolean>()
  const [isOwner, setIsOwner] = useState(false)
  const { ddo, price, metadata } = useAsset()

  useEffect(() => {
    if (!accountId || !owner) return

    const isOwner = accountId.toLowerCase() === owner.toLowerCase()
    setIsOwner(isOwner)
    setShowPricing(isOwner && price.type === '')
  }, [accountId, price, owner])

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
    <Edit setShowEdit={setShowEdit} />
  ) : showEditCompute ? (
    <EditComputeDataset setShowEdit={setShowEditCompute} />
  ) : (
    <article className={styles.grid}>
      <div>
        {showPricing && <Pricing ddo={ddo} />}
        <div className={styles.content}>
          <MetaMain />
          <Bookmark did={ddo.id} />

          {isInPurgatory ? (
            <Alert
              title={content.title}
              badge={`Reason: ${purgatoryData?.reason}`}
              text={content.description}
              state="error"
            />
          ) : (
            <>
              <Markdown
                className={styles.description}
                text={metadata?.additionalInformation?.description || ''}
              />

              <MetaSecondary />

              {isOwner && (
                <div className={styles.ownerActions}>
                  <Button style="text" size="small" onClick={handleEditButton}>
                    Edit Metadata
                  </Button>
                  {ddo.findServiceByType('compute') && (
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
  )
}
