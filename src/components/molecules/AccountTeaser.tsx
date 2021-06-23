import axios from 'axios'
import { toDataUrl } from 'ethereum-blockies'
import { Link } from 'gatsby'
import React, { useEffect, useState } from 'react'
import Dotdotdot from 'react-dotdotdot'
import { Profile } from '../../models/Profile'
import { useWeb3 } from '../../providers/Web3'
import get3BoxProfile from '../../utils/profile'
import styles from './AccountTeaser.module.css'

declare type AccountTeaserProps = {
  account: string
}

const Blockies = ({ account }: { account: string | undefined }) => {
  if (!account) return null
  const blockies = toDataUrl(account)

  return (
    <img
      className={styles.blockies}
      src={blockies}
      alt="Blockies"
      aria-hidden="true"
    />
  )
}

const AccountTeaser: React.FC<AccountTeaserProps> = ({ account }) => {
  const { accountId, networkId } = useWeb3()
  const [profile, setProfile] = useState<Profile>()

  useEffect(() => {
    if (!accountId) return
    const source = axios.CancelToken.source()
    async function get3Box() {
      const profile = await get3BoxProfile(accountId, source.token)
      if (!profile) return
      setProfile(profile)
    }
    get3Box()
  }, [accountId, networkId])

  return (
    <article className={styles.teaser}>
      <Link to={`/account/${accountId}`} className={styles.link}>
        <header className={styles.header}>
          <Dotdotdot clamp={3}>{profile && <h3> {profile.name}</h3>}</Dotdotdot>
          <div className={styles.details}>
            {profile.emoji || <Blockies account={accountId} />}
            <p>{accountId}</p>
          </div>
        </header>
        <div className={styles.content}>{profile?.description || ''}</div>
        <footer className={styles.footer}>
          {/* <div>add more account details</div> */}
        </footer>
      </Link>
    </article>
  )
}

export default AccountTeaser
