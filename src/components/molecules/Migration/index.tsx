import React, { ReactElement, useState, useEffect } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import Container from '../../atoms/Container'
import Alert from '../../atoms/Alert'
import styles from './migration.module.css'
import { useWeb3 } from '../../../providers/Web3'
import { useAsset } from '../../../providers/Asset'
import { useMigrationStatus } from '../../../providers/Migration'
import StartMigration from './startMigration'
import LockShares from './lockPoolShares'
import CompleteMigration from './createV4Pool'
import CancelMigration from './cancelMigration'
import MigrationCompleted from './migrationCompleted'
import UnlockPoolShares from './unlockPoolsShares'

const query = graphql`
  query {
    content: allFile(filter: { relativePath: { eq: "migration.json" } }) {
      edges {
        node {
          childContentJson {
            migrationComplete {
              title
              text
            }
            observer {
              migrationNotStarted {
                title
                text
              }
              migrationInProgress {
                title
                text
              }
            }
            owner {
              migrationNotStarted {
                title
                text
              }
              migrationStarted {
                title
                text
              }
              migrationInProgress {
                title
                text
              }
              deadlineMetThresholdMet {
                title
                text
              }
              deadlineMetThresholdNotMet {
                title
                text
              }
            }
            liquidityProvider {
              migrationNotStarted {
                title
                text
              }
              migrationStarted {
                title
                text
              }
              poolSharesLocked {
                title
                text
              }
              deadlineMetThresholdMet {
                title
                text
              }
              deadlineMetThresholdNotMet {
                title
                text
              }
            }
          }
        }
      }
    }
  }
`

enum MigrationAction {
  NONE = 'none',
  START_MIGRATION = 'startMigration',
  COMPLETE_MIGRATION = 'completeMigration',
  CANCEL_MIGRATION = 'cancelMigration',
  LOCK_SHARES = 'lockShares',
  REMOVE_SHARES = 'removeShares',
  VIEW_V4_ASSET = 'viewV4Asset'
}

enum MigrationStatus {
  NOT_STARTED = '0',
  ALLOWED = '1',
  MIGRATED = '2',
  COMPLETED = '3'
}

export default function Migration(): ReactElement {
  const [message, setMessage] = useState<string>()
  const [title, setTitle] = useState<string>()
  const [user, setUser] = useState<'observer' | 'owner' | 'liquidityProvider'>()
  const [action, setAction] = useState<MigrationAction>()
  const [sharesLocked, setSharesLocked] = useState<boolean>()
  const { accountId, block } = useWeb3()
  const { owner } = useAsset()
  const {
    status,
    thresholdMet,
    deadlinePassed,
    poolShares,
    poolShareOwners,
    lockedSharesV3,
    deadline
  } = useMigrationStatus()
  // Get content
  const data = useStaticQuery(query)
  const content = data.content.edges[0].node.childContentJson

  function getLockedSharesMessage() {
    return `\n\nYou have ${poolShares} pool shares\n\nYou have locked ${lockedSharesV3} shares`
  }

  function getRemainingBlocksMessage() {
    return `\n\n${
      parseInt(deadline) - block
    } blocks left for migration deadline`
  }

  function getMessageAndActionForOwner(
    status: string,
    thresholdMet: boolean,
    deadlinePassed: boolean,
    poolShares: number
  ): { title: string; message: string; action: MigrationAction } {
    const ownerContent = content.owner
    if (status === MigrationStatus.NOT_STARTED) {
      const { title, text } = ownerContent.migrationNotStarted
      return { title, message: text, action: MigrationAction.START_MIGRATION }
    }

    if (status === MigrationStatus.ALLOWED && thresholdMet && deadlinePassed) {
      const { title, text } = ownerContent.deadlineMetThresholdMet
      return {
        title,
        message: text,
        action: MigrationAction.COMPLETE_MIGRATION
      }
    }

    if (
      status !== MigrationStatus.NOT_STARTED &&
      deadlinePassed &&
      !thresholdMet
    ) {
      const { title, text } = ownerContent.deadlineMetThresholdNotMet
      return { title, message: text, action: MigrationAction.CANCEL_MIGRATION }
    }

    if (
      status !== MigrationStatus.NOT_STARTED &&
      poolShares > 0 &&
      !deadlinePassed
    ) {
      const { title, text } = ownerContent.migrationStarted
      return {
        title,
        message:
          'text' + getLockedSharesMessage() + getRemainingBlocksMessage(),
        action: MigrationAction.LOCK_SHARES
      }
    }

    if (
      status !== MigrationStatus.NOT_STARTED &&
      poolShares <= 0 &&
      !deadlinePassed
    ) {
      const { title, text } = ownerContent.migrationInProgress

      return {
        title,
        message: text + getLockedSharesMessage() + getRemainingBlocksMessage(),
        action: MigrationAction.LOCK_SHARES
      }
    }

    return {
      title: 'No migration information available',
      message: '',
      action: MigrationAction.NONE
    }
  }

  function getMessageAndActionForLiquidityProvider(
    status: string,
    thresholdMet: boolean,
    deadlinePassed: boolean,
    poolShares: number
  ): { title: string; message: string; action: MigrationAction } {
    const liquidityProviderContent = content.liquidityProvider
    if (status === MigrationStatus.NOT_STARTED) {
      const { title, text } = liquidityProviderContent.migrationNotStarted
      return { title, message: text, action: MigrationAction.NONE }
    }
    if (
      status !== MigrationStatus.NOT_STARTED &&
      !deadlinePassed &&
      poolShares > 0
    ) {
      const { title, text } = liquidityProviderContent.migrationStarted
      return {
        title,
        message: text + getLockedSharesMessage() + getRemainingBlocksMessage(),
        action: MigrationAction.LOCK_SHARES
      }
    }

    if (
      status !== MigrationStatus.NOT_STARTED &&
      !deadlinePassed &&
      poolShares <= 0
    ) {
      const { title, text } = liquidityProviderContent.poolSharesLocked
      return {
        title,
        message: text + getLockedSharesMessage() + getRemainingBlocksMessage(),
        action: MigrationAction.LOCK_SHARES
      }
    }

    if (
      status !== MigrationStatus.NOT_STARTED &&
      deadlinePassed &&
      thresholdMet
    ) {
      const { title, text } = liquidityProviderContent.deadlineMetThresholdMet
      return {
        title,
        message: text + getLockedSharesMessage(),
        action: MigrationAction.NONE
      }
    }

    if (
      status !== MigrationStatus.NOT_STARTED &&
      deadlinePassed &&
      !thresholdMet
    ) {
      const { title, text } =
        liquidityProviderContent.deadlineMetThresholdNotMet
      // TODO CHECK WHAT TO DO WITH THIS
      return { title, message: text, action: MigrationAction.NONE }
    }

    return {
      title: 'No migration information available',
      message: '',
      action: MigrationAction.NONE
    }
  }

  function getMessageAndActionForObserver(status: string): {
    title: string
    message: string
    action: MigrationAction
  } {
    const observerContent = content.observer
    if (status === MigrationStatus.NOT_STARTED) {
      const { title, message } = observerContent.migrationNotStarted
      return { title, message, action: MigrationAction.NONE }
    }
    if (status !== MigrationStatus.NOT_STARTED) {
      const { title, message } = observerContent.migrationInProgress
      return { title, message, action: MigrationAction.NONE }
    }
    return {
      title: 'No migration information available',
      message: '',
      action: MigrationAction.NONE
    }
  }

  function setTitleMessageAction(
    title: string,
    message: string,
    action: MigrationAction
  ) {
    setTitle(title)
    setMessage(message)
    setAction(action)
  }

  function switchMessageAndAction(
    user: 'observer' | 'owner' | 'liquidityProvider',
    status: string,
    thresholdMet: boolean,
    deadlinePassed: boolean,
    poolShares: number
  ) {
    if (status === MigrationStatus.COMPLETED) {
      const { title, message } = content.migrationComplete
      return setTitleMessageAction(
        title,
        message,
        MigrationAction.VIEW_V4_ASSET
      )
    }

    if (user === 'observer') {
      const { title, message, action } = getMessageAndActionForObserver(status)
      return setTitleMessageAction(title, message, action)
    }

    if (user === 'owner') {
      const { title, message, action } = getMessageAndActionForOwner(
        status,
        thresholdMet,
        deadlinePassed,
        poolShares
      )
      return setTitleMessageAction(title, message, action)
    }

    if (user === 'liquidityProvider') {
      const { title, message, action } =
        getMessageAndActionForLiquidityProvider(
          status,
          thresholdMet,
          deadlinePassed,

          poolShares
        )
      return setTitleMessageAction(title, message, action)
    }
  }

  useEffect(() => {
    if (owner.toLowerCase() === accountId.toLowerCase()) {
      setUser('owner')
    } else if (poolShares > 0 || (lockedSharesV3 && lockedSharesV3 !== '0')) {
      setUser('liquidityProvider')
    } else {
      setUser('observer')
    }
    // Check if user has already locked liquidity
    if (poolShareOwners) {
      for (let i = 0; i < poolShareOwners.length; i++) {
        if (accountId === poolShareOwners[i]) {
          setSharesLocked(true)
        }
      }
    }
    switchMessageAndAction(
      user,
      status,
      thresholdMet,
      deadlinePassed,
      poolShares
    )
  }, [
    owner,
    accountId,
    poolShares,
    user,
    status,
    thresholdMet,
    deadlinePassed,
    sharesLocked,
    poolShareOwners,
    poolShares,
    lockedSharesV3
  ])

  return (
    <>
      <header className={styles.header}>V4 Migration Status</header>
      <Container className={styles.container}>
        <Alert
          title={title}
          text={message}
          state="info"
          className={styles.alert}
        />
        {action === MigrationAction.START_MIGRATION && <StartMigration />}
        {action === MigrationAction.LOCK_SHARES && <LockShares />}
        {action === MigrationAction.COMPLETE_MIGRATION && <CompleteMigration />}
        {action === MigrationAction.CANCEL_MIGRATION && <CancelMigration />}
        {action === MigrationAction.VIEW_V4_ASSET && <MigrationCompleted />}
        {action === MigrationAction.REMOVE_SHARES && <UnlockPoolShares />}
      </Container>
    </>
  )
}
