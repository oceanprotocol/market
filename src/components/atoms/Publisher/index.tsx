import React, { ReactElement, useEffect, useState } from 'react'
import styles from './index.module.css'
import classNames from 'classnames/bind'
import { Profile } from '../../../models/Profile'
import { Link } from 'gatsby'
import get3BoxProfile from '../../../utils/profile'
import { accountTruncate } from '../../../utils/web3'
import axios from 'axios'
import Add from './Add'
import { useWeb3 } from '../../../providers/Web3'

const cx = classNames.bind(styles)

export default function Publisher({
  account,
  minimal,
  className
}: {
  account: string
  minimal?: boolean
  className?: string
}): ReactElement {
  const { networkId, accountId } = useWeb3()
  const [profile, setProfile] = useState<Profile>()
  const [name, setName] = useState<string>()

  const showAdd = account === accountId && !profile

  useEffect(() => {
    if (!account) return

    setName(accountTruncate(account))
    const source = axios.CancelToken.source()

    async function get3Box() {
      const profile = await get3BoxProfile(account, source.token)
      if (!profile) return

      setProfile(profile)
      const { name, emoji } = profile
      name && setName(`${emoji || ''} ${name}`)
    }
    get3Box()

    return () => {
      source.cancel()
    }
  }, [account])

  const styleClasses = cx({
    publisher: true,
    [className]: className
  })

  return (
    <div className={styleClasses}>
      {minimal ? (
        name
      ) : (
        <>
          <Link to={`/profile/${account}`} title="Show profile page.">
            {name}
          </Link>
          {showAdd && <Add />}
        </>
      )}
    </div>
  )
}
