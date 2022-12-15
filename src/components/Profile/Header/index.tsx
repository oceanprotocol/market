import React, { ReactElement, useEffect, useState } from 'react'
import PublisherLinks from './PublisherLinks'
import Markdown from '@shared/Markdown'
import Button from '@shared/atoms/Button'
import Stats from './Stats'
import Account from './Account'
import styles from './index.module.css'
import { useWeb3 } from '@context/Web3'
import { useProfile } from '@context/Profile'
import { useOrbis } from '@context/Orbis'

const isDescriptionTextClamped = () => {
  const el = document.getElementById('description')
  if (el) return el.scrollHeight > el.clientHeight
}

const LinkExternal = ({ url, text }: { url: string; text: string }) => {
  return (
    <a href={url} target="_blank" rel="noreferrer">
      {text}
    </a>
  )
}

const DmButton = ({ accountId }: { accountId: string }) => {
  const { ownAccount } = useProfile()
  const { accountId: ownAccountId, connect } = useWeb3()
  const { checkOrbisConnection, createConversation, getDid } = useOrbis()
  const [userDid, setUserDid] = useState<string | undefined>()
  const [isCreatingConversation, setIsCreatingConversation] = useState(false)

  const handleActivation = async (e: React.MouseEvent) => {
    e.preventDefault()
    const resConnect = await connect()
    if (resConnect) {
      await checkOrbisConnection({
        address: ownAccountId,
        autoConnect: true,
        lit: true
      })
    }
  }

  useEffect(() => {
    const getUserDid = async () => {
      const did = await getDid(accountId)
      setUserDid(did)
    }

    if (accountId) {
      getUserDid()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId])

  if (!ownAccount && userDid) {
    return (
      <div className={styles.dmButton}>
        <Button
          style="primary"
          size="small"
          disabled={!ownAccountId || isCreatingConversation}
          onClick={async () => {
            setIsCreatingConversation(true)
            await createConversation(userDid)
            setIsCreatingConversation(false)
          }}
        >
          {isCreatingConversation ? 'Loading...' : 'Send Direct Message'}
        </Button>
      </div>
    )
  }

  if (!ownAccountId) {
    return (
      <div className={styles.dmButton}>
        <Button style="primary" size="small" onClick={handleActivation}>
          Connect Wallet
        </Button>
      </div>
    )
  }
}

export default function AccountHeader({
  accountId
}: {
  accountId: string
}): ReactElement {
  const { profile } = useProfile()
  const [isShowMore, setIsShowMore] = useState(false)

  const toogleShowMore = () => {
    setIsShowMore(!isShowMore)
  }

  return (
    <div className={styles.grid}>
      <div>
        <Account accountId={accountId} />
        <Stats accountId={accountId} />
      </div>

      <div>
        <DmButton accountId={accountId} />
        <Markdown text={profile?.description} className={styles.description} />
        {isDescriptionTextClamped() ? (
          <span className={styles.more} onClick={toogleShowMore}>
            <LinkExternal
              url={`https://app.ens.domains/name/${profile?.name}`}
              text="Read more on ENS"
            />
          </span>
        ) : (
          ''
        )}
        {profile?.links?.length > 0 && (
          <PublisherLinks className={styles.publisherLinks} />
        )}
      </div>
      <div className={styles.meta}>
        Profile data from{' '}
        <LinkExternal
          url={`https://app.ens.domains/name/${profile?.name}`}
          text="ENS"
        />
      </div>
    </div>
  )
}
