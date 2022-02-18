import React, { ReactElement, useState } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import Container from '../../atoms/Container'
import Alert from '../../atoms/Alert'
import styles from './migration.module.css'
import { useWeb3 } from '../../../providers/Web3'
import { useAsset } from '../../../providers/Asset'
import { useMigrationStatus } from '../../../providers/Migration'
import StartMigration from './startMigration'

const query = graphql`
  query {
    content: allFile(filter: { relativePath: { eq: "migration.json" } }) {
      edges {
        node {
          childContentJson {
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
  const { accountId } = useWeb3()
  const { owner } = useAsset()
  const { status, thresholdMet, deadlinePassed, poolShares } =
    useMigrationStatus()
  // Get content
  const data = useStaticQuery(query)
  const content = data.content.edges[0].node.childContentJson

  return (
    <>
      <header className={styles.header}>V4 Migration Status</header>
      <Container className={styles.container}>
        {owner === accountId && status === '0' && (
          // Message for Pool Owner: Migration has not been started.
          // Action: Owner can start migration
          <>
            <Alert
              title={content.owner.migrationNotStarted.title}
              text={content.owner.migrationNotStarted.text}
              state="info"
              className={styles.alert}
            />
            <StartMigration />
          </>
        )}
        {owner === accountId &&
          status !== '0' &&
          thresholdMet !== true &&
          !deadlinePassed && (
            // Message for Pool Owner: Migration has been started. Waiting for the deadline.
            <Alert
              title={content.owner.migrationInProgress.title}
              text={content.owner.migrationInProgress.text}
              state="info"
            />
          )}
        {owner === accountId &&
          status === '1' &&
          thresholdMet &&
          deadlinePassed && (
            // Message for Pool Owner: Deadline has passed & Threshold has been met.
            // Action: Migration can now be completed.
            <Alert
              title={content.owner.deadlineMetThresholdMet.title}
              text={content.owner.deadlineMetThresholdMet.text}
              state="info"
            />
          )}
        {owner === accountId && status !== '0' && thresholdMet !== true && (
          // Message for Pool Owner: Deadline has passed & Threshold has NOT been met.
          // Action: Migration can now be canceled.
          <Alert
            title={content.owner.deadlineMetThresholdNotMet.title}
            text={content.owner.deadlineMetThresholdNotMet.text}
            state="info"
          />
        )}
        {owner !== accountId &&
          status !== '0' &&
          poolShares !== '0' &&
          poolShares !== undefined && (
            // Message for Liquidity Provider: Migration has not yet been started by pool owner.
            <>
              <Alert
                title={content.liquidityProvider.migrationNotStarted.title}
                text={content.liquidityProvider.migrationNotStarted.text}
                state="info"
              />
              `You currently have ${poolShares} Pool Shares`
            </>
          )}
        {owner !== accountId &&
          status !== '0' &&
          poolShares !== '0' &&
          poolShares !== undefined && (
            // Message for Liquidity Provider: Migration has been started by pool owner.
            // Action: Lock your pool shares.
            <>
              <Alert
                title={content.liquidityProvider.migrationStarted.title}
                text={content.liquidityProvider.migrationStarted.text}
                state="info"
              />
              `You currently have ${poolShares} Pool Shares`
            </>
          )}
        {!deadlinePassed &&
          owner !== accountId &&
          status !== '0' &&
          poolShares !== '0' &&
          poolShares !== undefined && (
            // Message for Liquidity Provider: Your pool shares have been locked.
            <Alert
              title={content.liquidityProvider.poolSharesLocked.title}
              text={content.liquidityProvider.poolSharesLocked.text}
              state="info"
            />
          )}
        {deadlinePassed &&
          owner !== accountId &&
          status !== '0' &&
          poolShares !== '0' &&
          poolShares !== undefined &&
          thresholdMet === true && (
            // Message for Liquidity Provider: Migration has been a success.
            <Alert
              title={content.liquidityProvider.deadlineMetThresholdMet.title}
              text={content.liquidityProvider.deadlineMetThresholdMet.text}
              state="info"
            />
          )}
        {deadlinePassed &&
          owner !== accountId &&
          status !== '0' &&
          poolShares !== '0' &&
          poolShares !== undefined &&
          thresholdMet === false && (
            // Message for Liquidity Provider: Migration has not met threshold.
            <Alert
              title={content.liquidityProvider.deadlineMetThresholdMet.title}
              text={content.liquidityProvider.deadlineMetThresholdMet.text}
              state="info"
            />
          )}
      </Container>
    </>
  )
}
