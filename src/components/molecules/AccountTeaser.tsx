import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Profile } from '../../models/Profile'
import get3BoxProfile from '../../utils/profile'

declare type AccountTeaserProps = {
  account: string
}

const AccountTeaser: React.FC<AccountTeaserProps> = ({ account }) => {
  const [profile, setProfile] = useState<Profile>()

  useEffect(() => {
    if (!account) return
    const source = axios.CancelToken.source()
    async function get3Box() {
      const profile = await get3BoxProfile(account, source.token)
      if (!profile) return
      setProfile(profile)
      console.log('PROFILE: ', profile)
    }
    get3Box()
  }, [account])

  return (
    <article>
      <div>Profile</div>
    </article>
  )
}

export default AccountTeaser
