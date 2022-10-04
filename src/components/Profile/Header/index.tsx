import React, { ReactElement, useEffect, useState } from 'react'
import PublisherLinks from './PublisherLinks'
import Markdown from '@shared/Markdown'
import Button from '@shared/atoms/Button'
import Stats from './Stats'
import Account from './Account'
import styles from './index.module.css'
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
  const { profile } = useProfile()
  const { orbis, account } = useOrbis()
  const [isShowMore, setIsShowMore] = useState(false)
  const [userDid, setUserDid] = useState<string>()

  const toogleShowMore = () => {
    setIsShowMore(!isShowMore)
  }

  const getDid = async () => {
    const { data, error } = await orbis.getDids(accountId)
    if (data) {
      if (data.length > 0) {
        setUserDid(data[0])
      } else {
        setUserDid('did:pkh:eip155:1:' + accountId.toLocaleLowerCase())
      }
    }

    if (error) {
      console.log(error)
    }
  }

  const createConversation = async () => {
    // const res = await orbis.createConversation({
    //   recipients: [userDid]
    // })
    // if (res.status === 200) {
    //   console.log(res)
    // }
    console.log('clicked')
  }

  useEffect(() => {
    console.log(userDid)
  }, [userDid])

  const clickHandler = () => {
    console.log(accountId)
    console.log(account)
    getDid()
    createConversation()
  }

  return (
    <div className={styles.grid}>
      <div>
        <Account accountId={accountId} />
        <Stats accountId={accountId} />
      </div>

      <div>
        <div className={styles.buttonWrap}>
          <Button
            style="primary"
            size="small"
            className={styles.sendMessage}
            onClick={clickHandler}
          >
            Send Messages
          </Button>
        </div>
        <Markdown text={profile?.description} className={styles.description} />
        {isDescriptionTextClamped() ? (
          <span className={styles.more} onClick={toogleShowMore}>
            <LinkExternal
              url={`https://www.3box.io/${accountId}`}
              text="Read more on 3box"
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
        {profile?.accountEns && (
          <>
            <LinkExternal
              url={`https://app.ens.domains/name/${profile.accountEns}`}
              text="ENS"
            />{' '}
            &{' '}
          </>
        )}
        <LinkExternal
          url={`https://www.3box.io/${accountId}`}
          text="3Box Hub"
        />
      </div>
    </div>
  )
}
