import React, { ReactElement, useEffect, useState } from 'react'
import styles from './Byline.module.css'
import { accountTruncate } from '../../../utils/wallet'
import Partner from '../../atoms/Partner'
import { ReactComponent as External } from '../../../images/external.svg'
import { Link } from 'gatsby'
import EtherscanLink from '../../atoms/EtherscanLink'
import { useOcean } from '@oceanprotocol/react'
import { useDataPartner } from '../../../hooks/useDataPartner'
import get3BoxProfile from '../../../utils/profile'
import axios from 'axios'
import { Profile } from '../../../models/Profile'
import { Logger } from '@oceanprotocol/lib'

export default function Byline({
  owner,
  prefix
}: {
  owner: string
  prefix?: string
}): ReactElement {
  const { networkId } = useOcean()
  const { partner } = useDataPartner(owner)
  const [profile, setProfile] = useState<Profile>()

  useEffect(() => {
    if (!owner) return

    const source = axios.CancelToken.source()
    async function get3Box() {
      try {
        const profile = await get3BoxProfile(owner, source.token)
        if (!profile) return
        setProfile(profile)
        Logger.log(
          `Found 3box profile for ${owner}: ${JSON.stringify(profile)}`
        )
      } catch (error) {
        Logger.log('No 3box profile')
      }
    }
    get3Box()

    return () => {
      source.cancel()
    }
  }, [owner])

  return (
    <div className={styles.byline}>
      {prefix}
      <Link
        to={`/search/?owner=${owner}`}
        title="Show all data sets created by this account."
      >
        {partner ? (
          <Partner partner={partner} />
        ) : (
          owner && accountTruncate(owner)
        )}
      </Link>
      <div className={styles.bylineLinks}>
        {' — '}
        {partner &&
          Object.entries(partner.links).map(([key, value]) => (
            <a href={value} key={key} target="_blank" rel="noreferrer">
              {key} <External className={styles.bylineExternal} />
            </a>
          ))}
        <EtherscanLink networkId={networkId} path={`address/${owner}`}>
          Etherscan
        </EtherscanLink>
      </div>
    </div>
  )
}
