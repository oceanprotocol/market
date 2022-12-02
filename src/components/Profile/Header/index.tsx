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

export default function AccountHeader({
  accountId
}: {
  accountId: string
}): ReactElement {
  const { profile, ownAccount } = useProfile()
  const { accountId: ownAccountId } = useWeb3()
  const { createConversation, getDid } = useOrbis()
  const [isShowMore, setIsShowMore] = useState(false)
  const [userDid, setUserDid] = useState<string | undefined>()

  const toogleShowMore = () => {
    setIsShowMore(!isShowMore)
  }

  useEffect(() => {
    const getUserDid = async () => {
      const did = await getDid(accountId)
      console.log(did)
      setUserDid(did)
    }

    if (accountId) {
      getUserDid()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId])

  return (
    <div className={styles.grid}>
      <div>
        <Account accountId={accountId} />
        <Stats accountId={accountId} />
      </div>

      <div>
        {!ownAccount && userDid && (
          <div className={styles.dmButton}>
            <Button
              style="primary"
              size="small"
              disabled={!ownAccountId}
              onClick={() => createConversation(userDid)}
            >
              Send Direct Message
            </Button>
            {!ownAccountId && <span>Please connect your wallet</span>}
          </div>
        )}
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
