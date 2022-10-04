import React, { useState, useEffect } from 'react'
import { useCancelToken } from '@hooks/useCancelToken'
import { useOrbis } from '@context/Orbis'
import { accountTruncate } from '@utils/web3'
import get3BoxProfile from '@utils/profile'
import { didToAddress } from '@utils/orbis'
import Blockies from '@shared/atoms/Blockies'
import Time from '@shared/atoms/Time'
import styles from './ConversationItem.module.css'

export default function ConversationItem({
  conversation,
  unreads,
  onClick
}: {
  conversation: OrbisConversationInterface
  unreads: number
  onClick: (param: OrbisConversationInterface | null) => void
}) {
  const { account } = useOrbis()

  const newCancelToken = useCancelToken()

  const [name, setName] = useState(null)
  const [address, setAddress] = useState(null)
  const [image, setImage] = useState(null)

  useEffect(() => {
    const getProfile = async () => {
      const details = conversation.recipients_details.find(
        (o) => o.did !== account.did
      )

      const _address = didToAddress(details.did)
      setAddress(_address)

      if (details?.metadata?.ensName) {
        setName(details?.metadata?.ensName)
      } else if (details?.profile?.username) {
        setName(details?.profile?.username)
      } else {
        setName(accountTruncate(_address))
      }

      const profile = await get3BoxProfile(_address, newCancelToken())

      setImage(profile?.image)
    }

    if (conversation && account) {
      getProfile()
    }
  }, [conversation, account, newCancelToken])

  return (
    <div
      className={styles.conversationItem}
      onClick={() => onClick(conversation)}
    >
      <div className={styles.accountAvatarSet}>
        <Blockies
          accountId={address}
          className={styles.accountAvatar}
          image={image}
        />
        {unreads > 0 && (
          <div className={styles.notificationCount}>{unreads}</div>
        )}
      </div>
      <div className={styles.accountInfo}>
        <div className={styles.accountHeading}>
          <h3 className={styles.accountName}>{name}</h3>
          <span className={styles.lastMessageDate}>
            <Time
              date={conversation.last_message_timestamp.toString()}
              isUnix={true}
              relative
            />
          </span>
        </div>
        {/* <p className={styles.accountChat}>{conversation.chat}</p> */}
      </div>
    </div>
  )
}
