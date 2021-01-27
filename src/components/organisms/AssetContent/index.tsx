import React, { ReactElement, useEffect, useState } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import Markdown from '../../atoms/Markdown'
import MetaFull from './MetaFull'
import MetaSecondary from './MetaSecondary'
import MetaEwai from './MetaEwai'
import styles from './index.module.css'
import AssetActions from '../AssetActions'
import { useUserPreferences } from '../../../providers/UserPreferences'
import Pricing from './Pricing'
import { useOcean } from '@oceanprotocol/react'
import Bookmark from './Bookmark'
import { useAsset } from '../../../providers/Asset'
import Alert from '../../atoms/Alert'
import Button from '../../atoms/Button'
import Edit from '../AssetActions/Edit'
import DebugOutput from '../../atoms/DebugOutput'
import MetaMain from './MetaMain'
// import EditHistory from './EditHistory'
import { EwaiClient, useEwaiInstance } from '../../../ewai/client/ewai-js'
import SuccessConfetti from '../../atoms/SuccessConfetti'
import Modal from '../../atoms/Modal'

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

interface IResetDataStatus {
  performed: boolean
  completedOk: boolean | null
  confirmDialogOpen: boolean
}

export default function AssetContent(props: AssetContentProps): ReactElement {
  const data = useStaticQuery(contentQuery)
  const ewaiInstance = useEwaiInstance()
  const content = data.purgatory.edges[0].node.childContentJson.asset
  const { debug } = useUserPreferences()
  const { accountId } = useOcean()
  const { owner, isInPurgatory, purgatoryData } = useAsset()
  const [showPricing, setShowPricing] = useState(false)
  const [showEdit, setShowEdit] = useState<boolean>()
  const [showEditButton, setShowEditButton] = useState<boolean>(false)
  const { ddo, price, metadata } = useAsset()
  const isOwner = accountId === owner
  //const [resetDataStatus, setResetDataStatus] = useState<IResetDataStatus>({
  //  performed: false,
  //  completedOk: null,
  //  confirmDialogOpen: false
  //})
  const [resetDataPerformed, setResetDataPerformed] = useState<boolean>(false)
  const [resetDataCompletedOk, setResetDataCompletedOk] = useState<boolean>(
    false
  )
  const [
    resetDataConfirmDialogOpen,
    setResetDataConfirmDialogOpen
  ] = useState<boolean>(false)

  useEffect(() => {
    if (!price) return
    setShowPricing(isOwner && price.address === '')
  }, [isOwner, price])

  // Only show edit and reset buttons if they have proper roles set
  useEffect(() => {
    let mounted = true
    if (ewaiInstance.enforceMarketplacePublishRole && accountId && isOwner) {
      const checkRoles = async () => {
        const ewaiClient = new EwaiClient({
          username: process.env.EWAI_API_USERNAME,
          password: process.env.EWAI_API_PASSWORD,
          graphQlUrl: process.env.EWAI_API_GRAPHQL_URL
        })
        const canPubResult = await ewaiClient.ewaiCanPublishAssetsOnMarketplaceAsync(
          accountId
        )
        // to prevent the Can't perform a React state update on an unmounted component
        // react error/warning/memory leak:
        if (mounted) {
          setShowEditButton(canPubResult.canPublish)
        }
      }
      checkRoles()
    } else {
      setShowEditButton(isOwner)
    }
    return function cleanup() {
      mounted = false
    }
  }, [isOwner, accountId])

  function handleEditButton() {
    // move user's focus to top of screen
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    //setResetDataStatus({
    //  performed: false,
    //  completedOk: null,
    //  confirmDialogOpen: false
    //})
    setResetDataConfirmDialogOpen(false)
    setShowEdit(true)
  }

  function ConfirmResetDataModal({
    isOpen,
    onToggleModal
  }: {
    isOpen: boolean
    onToggleModal: () => void
  }): ReactElement {
    //setResetDataStatus({
    //  performed: false,
    //  completedOk: null,
    //  confirmDialogOpen: false
    //})
    setResetDataPerformed(false)
    return (
      <Modal
        title="Confirm Reset Data"
        isOpen={isOpen}
        onToggleModal={onToggleModal}
      >
        <p>
          Are you sure you want to reset all of the data in this EWAI asset?
          This action cannot be undone!
        </p>
        <button
          className="Button-module--button--XbPwb Button-module--primary--3zvkW"
          onClick={() => {
            //setResetDataStatus({
            //  performed: false,
            //  completedOk: null,
            //  confirmDialogOpen: false
            //})
            setResetDataConfirmDialogOpen(false)
            performEwaiResetData()
          }}
        >
          OK
        </button>
        &nbsp;&nbsp;
        <button
          className="Button-module--button--XbPwb Button-module--primary--3zvkW"
          onClick={() => {
            //setResetDataStatus({
            //  performed: false,
            //  completedOk: null,
            //  confirmDialogOpen: false
            //})
            setResetDataConfirmDialogOpen(false)
          }}
        >
          CANCEL
        </button>
      </Modal>
    )
  }

  function performEwaiResetData() {
    //setResetDataStatus({
    //  performed: false,
    //  completedOk: null,
    //  confirmDialogOpen: false
    //})
    setResetDataPerformed(false)
    const ewaiClient = new EwaiClient({
      username: process.env.EWAI_API_USERNAME,
      password: process.env.EWAI_API_PASSWORD,
      graphQlUrl: process.env.EWAI_API_GRAPHQL_URL
    })
    ewaiClient
      .resetEwaiAssetDataAsync(ddo.id)
      .then((result) => {
        //setResetDataStatus({
        //  performed: true,
        //  completedOk: result,
        //  confirmDialogOpen: false
        //})
        setResetDataCompletedOk(result)
        setResetDataPerformed(true)
      })
      .catch((error) => {
        //setResetDataStatus({
        //  performed: true,
        //  completedOk: false,
        //  confirmDialogOpen: false
        //})
        setResetDataCompletedOk(false)
        setResetDataPerformed(true)
      })
  }

  const showEditButtons = isOwner && showEditButton
  //  const showResetDataSuccessConfetti =
  //    showEditButtons && resetDataStatus.performed && resetDataStatus.completedOk
  //  const showResetDataError =
  //    showEditButtons && resetDataStatus.performed && !resetDataStatus.completedOk
  const showResetDataSuccessConfetti =
    showEditButtons && resetDataPerformed && resetDataCompletedOk
  const showResetDataError =
    showEditButtons && resetDataPerformed && !resetDataCompletedOk

  return showEdit ? (
    <Edit setShowEdit={setShowEdit} />
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
              <MetaEwai />
              {resetDataConfirmDialogOpen && (
                <ConfirmResetDataModal
                  isOpen={resetDataConfirmDialogOpen}
                  onToggleModal={() =>
                    //setResetDataStatus({
                    //  performed: false,
                    //  completedOk: undefined,
                    //  confirmDialogOpen: false
                    //})
                    setResetDataConfirmDialogOpen(false)
                  }
                />
              )}
              {showResetDataSuccessConfetti && (
                <SuccessConfetti success="Reset Data Completed OK" />
              )}
              {showResetDataError && (
                <Alert
                  className={styles.success}
                  text="Reset Data Status"
                  state={resetDataCompletedOk ? 'success' : 'error'}
                  action={{
                    name: resetDataCompletedOk
                      ? 'Reset Data Completed OK'
                      : 'Error Resetting Data',
                    style: 'primary',
                    handleAction: () => {
                      //setResetDataStatus({
                      //  performed: false,
                      //  completedOk: undefined,
                      //  confirmDialogOpen: false
                      //})
                      setResetDataPerformed(false)
                    }
                  }}
                />
              )}
              {showEditButtons && (
                <div className={styles.ownerActions}>
                  <Button style="text" size="small" onClick={handleEditButton}>
                    Edit Metadata
                  </Button>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Button
                    style="text"
                    size="small"
                    onClick={() => {
                      //setResetDataStatus({
                      //  performed: false,
                      //  completedOk: undefined,
                      //  confirmDialogOpen: true
                      //})
                      setResetDataConfirmDialogOpen(true)
                    }}
                  >
                    Reset Data
                  </Button>
                </div>
              )}
            </>
          )}

          <MetaFull />
          {/* <EditHistory /> */}
          {debug === true && <DebugOutput title="DDO" output={ddo} />}
        </div>
      </div>

      <div className={styles.actions}>
        <AssetActions />
      </div>
    </article>
  )
}
