import React, { ReactElement } from 'react'
import styles from './Byline.module.css'
import { accountTruncate } from '../../../utils/wallet'
import Partner from '../../atoms/Partner'
import { ReactComponent as External } from '../../../images/external.svg'
import listPartners from '../../../../content/list-datapartners.json'
import { Link } from 'gatsby'
import EtherscanLink from '../../atoms/EtherscanLink'
import { useOcean } from '@oceanprotocol/react'

const partnerAccounts = listPartners.map((partner) =>
  partner.accounts.join(',')
)

export default function Byline({ owner }: { owner: string }): ReactElement {
  const { networkId } = useOcean()
  const isDataPartner = owner && partnerAccounts.includes(owner)
  const dataPartner = listPartners.filter((partner) =>
    partner.accounts.includes(owner)
  )[0]

  return (
    <div className={styles.byline}>
      Published by{' '}
      <Link
        to={`/search/?owner=${owner}`}
        title="Show all data sets created by this account."
      >
        {isDataPartner ? (
          <Partner partner={dataPartner} />
        ) : (
          owner && accountTruncate(owner)
        )}
      </Link>
      {' —'}
      <div className={styles.bylineLinks}>
        {isDataPartner &&
          Object.entries(dataPartner.links).map(([key, value]) => (
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
