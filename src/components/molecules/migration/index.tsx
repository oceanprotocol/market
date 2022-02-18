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

const query = graphql`
  query {
    content: allFile(filter: { relativePath: { eq: "migration.json" } }) {
      edges {
        node {
          childContentJson {
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

export default function Migration(): ReactElement {
  const [message, setMessage] = useState<string>()
  const [title, setTitle] = useState<string>()
  const [user, setUser] = useState<'observer' | 'owner' | 'liquidityProvider'>()
  const [action, setAction] =
    useState<
      | 'none'
      | 'startMigration'
      | 'completeMigration'
      | 'cancelMigration'
      | 'lockShares'
      | 'removeShares'
    >()
  const [sharesLocked, setSharesLocked] = useState<boolean>()
  const { accountId } = useWeb3()
  const { owner } = useAsset()
  const { status, thresholdMet, deadlinePassed, poolShares } =
    useMigrationStatus()
  // Get content
  const data = useStaticQuery(query)
  const content = data.content.edges[0].node.childContentJson

  function switchMessage(
    user: 'observer' | 'owner' | 'liquidityProvider',
    status: string,
    thresholdMet: boolean,
    deadlinePassed: boolean,
    sharesLocked: boolean
  ) {
    console.log('User', user)
    if (user === 'observer' && status === '0') {
      // Message for Observer: Migration has not been started.
      setTitle(content.observer.migrationNotStarted.title)
      setMessage(content.observer.migrationNotStarted.text)
      setAction('none')
    } else if (user === 'observer' && status === '1') {
      // Message for Observer: Migration has been started.
      setTitle(content.observer.migrationInProgress.title)
      setMessage(content.observer.migrationInProgress.text)
      setAction('none')
    } else if (user === 'owner' && status === '0') {
      // Message for Pool Owner: Migration has not been started.
      setTitle(content.owner.migrationNotStarted.title)
      setMessage(content.owner.migrationNotStarted.text)
      // Action: Owner can start migration
      setAction('startMigration')
    } else if (
      user === 'owner' &&
      status !== '0' &&
      !thresholdMet &&
      !deadlinePassed
    ) {
      // Message for Pool Owner: Migration has been started. Waiting for the deadline.
      setTitle(content.owner.migrationInProgress.title)
      setMessage(content.owner.migrationInProgress.text)
      setAction('none')
    } else if (
      user === 'owner' &&
      status === '1' &&
      thresholdMet &&
      deadlinePassed
    ) {
      // Message for Pool Owner: Deadline has passed & Threshold has been met.
      setTitle(content.owner.deadlineMetThresholdMet.title)
      setMessage(content.owner.deadlineMetThresholdMet.text)
      // Action: Migration can now be completed.
      setAction('completeMigration')
    } else if (user === 'owner' && status !== '0' && !thresholdMet) {
      // Message for Pool Owner: Deadline has passed & Threshold has NOT been met.
      setTitle(content.owner.deadlineMetThresholdNotMet.title)
      setMessage(content.owner.deadlineMetThresholdNotMet.text)
      // Action: Migration can now be canceled.
      setAction('cancelMigration')
    } else if (user === 'liquidityProvider' && status === '0') {
      // Message for Liquidity Provider: Migration has not yet been started by pool owner.
      setTitle(content.liquidityProvider.migrationNotStarted.title)
      setMessage(content.liquidityProvider.migrationNotStarted.text)
      setAction('none')
    } else if (user === 'liquidityProvider' && status !== '0') {
      // Message for Liquidity Provider: Migration has been started by pool owner.
      setTitle(content.liquidityProvider.migrationStarted.title)
      setMessage(content.liquidityProvider.migrationStarted.text)
      // Action: Lock your pool shares.
      setAction('lockShares')
    } else if (user === 'liquidityProvider' && status === '1' && sharesLocked) {
      // Message for Liquidity Provider: Your pool shares have been locked.
      setTitle(content.liquidityProvider.poolSharesLocked.title)
      setMessage(content.liquidityProvider.poolSharesLocked.text)
      setAction('none')
    } else if (
      user === 'liquidityProvider' &&
      deadlinePassed &&
      status === '1' &&
      thresholdMet === true
    ) {
      // Message for Liquidity Provider: Migration has been a success.
      setTitle(content.liquidityProvider.deadlineMetThresholdMet.title)
      setMessage(content.liquidityProvider.deadlineMetThresholdMet.text)
      setAction('none')
    } else if (
      user === 'liquidityProvider' &&
      deadlinePassed &&
      status === '1' &&
      thresholdMet === false
    ) {
      setTitle(content.liquidityProvider.deadlineMetThresholdMet.title)
      setMessage(content.liquidityProvider.deadlineMetThresholdMet.text)
      setAction('none')
    }
  }
  useEffect(() => {
    if (owner.toLowerCase() === accountId.toLowerCase()) {
      setUser('owner')
    } else if (poolShares !== undefined) {
      setUser('liquidityProvider')
    } else {
      setUser('observer')
    }
    setSharesLocked(false) // TODO: check if shares have already been locked
    switchMessage(user, status, thresholdMet, deadlinePassed, sharesLocked)
  }, [
    owner,
    accountId,
    poolShares,
    user,
    status,
    thresholdMet,
    deadlinePassed,
    sharesLocked
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
        {action === 'startMigration' && <StartMigration />}
        {action === 'lockShares' && <LockShares />}
        {action === 'completeMigration' && <CompleteMigration />}
        {action === 'cancelMigration' && <CancelMigration />}
      </Container>
    </>
  )
}
