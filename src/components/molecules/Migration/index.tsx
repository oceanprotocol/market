import { graphql, useStaticQuery } from 'gatsby'
import React, { ReactElement, useEffect, useState } from 'react'
import Web3 from 'web3'
import { useMigrationStatus } from '../../../providers/Migration'
import { useWeb3 } from '../../../providers/Web3'
import Alert from '../../atoms/Alert'
import Container from '../../atoms/Container'
import LockShares from './LockPoolShares'
import styles from './index.module.css'

const query = graphql`
  query {
    content: allFile(filter: { relativePath: { eq: "migration.json" } }) {
      edges {
        node {
          childContentJson {
            liquidityProvider {
              migrationStarted {
                title
                text
              }
              poolSharesLocked {
                title
                text
              }
              deadlineMet {
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
  LOCK_SHARES = 'lockShares'
}

export default function Migration(): ReactElement {
  const [message, setMessage] = useState<string>()
  const [title, setTitle] = useState<string>()
  const [showMigration, setShowMigration] = useState<boolean>(false)
  const [action, setAction] = useState<MigrationAction>()
  const { accountId } = useWeb3()
  const { canAddShares, deadlinePassed, poolShares, lockedSharesV3 } =
    useMigrationStatus()
  // Get content
  const data = useStaticQuery(query)
  const content = data.content.edges[0].node.childContentJson

  function getNoLockedSharesMessage() {
    const poolSharesRounded = isNaN(Number(poolShares))
      ? 0
      : Number(poolShares).toFixed(3)
    return `\n\nYou currently have ${poolSharesRounded} pool shares\n\nYou have locked 0 shares`
  }
  function getLockedSharesMessage(lockedShares: number) {
    return `\n\nYou have locked ${lockedShares.toFixed(3)} shares`
  }

  function getMessageAndAction(
    deadlinePassed: boolean,
    lockedShares: number
  ): {
    title: string
    message: string
    action: MigrationAction
  } {
    const liquidityProviderContent = content.liquidityProvider

    if (deadlinePassed) {
      const { title, text } = liquidityProviderContent.deadlineMet
      return {
        title,
        message: text + getLockedSharesMessage(lockedShares),
        action: MigrationAction.NONE
      }
    } else if (!deadlinePassed && lockedShares <= 0) {
      const { title, text } = liquidityProviderContent.migrationStarted
      return {
        title,
        message: text + getNoLockedSharesMessage(),
        action: MigrationAction.LOCK_SHARES
      }
    } else if (!deadlinePassed && lockedShares > 0) {
      const { title, text } = liquidityProviderContent.poolSharesLocked
      return {
        title,
        message: text + getLockedSharesMessage(lockedShares),
        action: MigrationAction.NONE
      }
    }
  }

  useEffect(() => {
    const poolSharesNumber = isNaN(Number(poolShares)) ? 0 : Number(poolShares)
    const lockedSharesNumber = Number(Web3.utils.fromWei(lockedSharesV3 || '0'))
    if (canAddShares && (poolSharesNumber > 0 || lockedSharesNumber !== 0)) {
      setShowMigration(true)
    } else {
      setShowMigration(false)
      return
    }

    const { title, message, action } = getMessageAndAction(
      deadlinePassed,
      lockedSharesNumber
    )
    setTitle(title)
    setMessage(message)
    setAction(action)
  }, [accountId, poolShares, deadlinePassed, lockedSharesV3, canAddShares])

  return (
    <>
      {showMigration ? (
        <>
          <header className={styles.header}>Pool Share Lock Status</header>
          <Container className={styles.container}>
            <Alert
              title={title}
              text={message}
              state={Number(lockedSharesV3) > 0 ? 'success' : 'info'}
              className={styles.alert}
            />
            {action === MigrationAction.LOCK_SHARES && <LockShares />}
          </Container>
        </>
      ) : null}
    </>
  )
}
