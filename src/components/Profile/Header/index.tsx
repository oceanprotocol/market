import React, { ReactElement, useEffect, useState } from 'react'
import PublisherLinks from './PublisherLinks'
import Markdown from '@shared/Markdown'
import Button from '@shared/atoms/Button'
import Stats from './Stats'
import Account from './Account'
import styles from './index.module.css'
import { useProfile } from '@context/Profile'
import { useOrbis } from '@context/Orbis'
import { Context } from 'urql'
import { filter } from 'lodash'
import { sleep } from '@utils/index'

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
  const {
    orbis,
    account,
    convOpen,
    setConvOpen,
    conversationId,
    setConversationId,
    conversations
  } = useOrbis()
  const [isShowMore, setIsShowMore] = useState(false)
  const [userDid, setUserDid] = useState<string>()

  const toogleShowMore = () => {
    setIsShowMore(!isShowMore)
  }

  const getDid = async () => {
    const { data, error } = await orbis.getDids(accountId)
    console.log(data)
    if (data) {
      if (data.length > 0) {
        console.log(data[0].did)
        setUserDid(data[0].did)
      } else if (accountId) {
        console.log(accountId)
        setUserDid('did:pkh:eip155:1:' + accountId?.toLocaleLowerCase())
      } else {
        console.log('try again')
        await sleep(1000)
        getDid()
      }
    }

    if (error) {
      console.log(error)
    }
  }

  const createConversation = async () => {
    const res = await orbis.createConversation({
      recipients: [userDid],
      context: 'ocean_market'
    })
    if (res.status === 200) {
      console.log(res)
      const { data } = await orbis.getConversation(res.doc)
      console.log(data)
      setConversationId(res.doc)
      setConvOpen(true)
    }
    console.log('clicked')
  }

  useEffect(() => {
    if (orbis && accountId) {
      getDid()
      // console.log(userDid)
    }
  }, [accountId])

  const clickHandler = () => {
    console.log(accountId)
    console.log(account)
    getDid()
    createConversation()
  }

  const checkConversation = () => {
    const filtered = conversations.filter(
      (conversation: OrbisConversationInterface) => {
        // console.log(conversation)
        console.log(userDid)
        return conversation.recipients.includes(userDid)
      }
    )
    if (!filtered.length) {
      if (userDid) {
        createConversation()
      }
    }
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
            disabled={!userDid}
            onClick={checkConversation}
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
