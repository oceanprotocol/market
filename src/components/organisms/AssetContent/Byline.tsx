import React, { ReactElement } from 'react'
import styles from './Byline.module.css'
import { accountTruncate } from '../../../utils/wallet'
import Partner from '../../atoms/Partner'
import { ReactComponent as External } from '../../../images/external.svg'
import { Link } from 'gatsby'
import EtherscanLink from '../../atoms/EtherscanLink'
import { useOcean } from '@oceanprotocol/react'
import { useDataPartner } from '../../../hooks/useDataPartner'

export default function Byline({
  owner,
  prefix
}: {
  owner: string
  prefix?: string
}): ReactElement {
  const { networkId } = useOcean()
  const { partner } = useDataPartner(owner)

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
