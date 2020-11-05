import React, { ReactElement } from 'react'
import { ReactComponent as PartnerIcon } from '../../images/partner.svg'
import styles from './Partner.module.css'
import classNames from 'classnames/bind'
import Tooltip from './Tooltip'
import { PartnerData } from '@oceanprotocol/list-datapartners/types'

const cx = classNames.bind(styles)

export function PartnerBadge(): ReactElement {
  return (
    <span className={styles.badge}>
      <PartnerIcon />
    </span>
  )
}

export default function Partner({
  partner,
  className
}: {
  partner: PartnerData
  className?: string
}): ReactElement {
  const styleClasses = cx({
    partner: true,
    [className]: className
  })

  return (
    <span className={styleClasses}>
      <Tooltip
        content={
          <>
            Ocean Protocol{' '}
            <a href="https://github.com/oceanprotocol/list-datapartners">
              Data Partner
            </a>
          </>
        }
        placement="top"
      >
        <PartnerBadge />
        {partner.name}
      </Tooltip>
    </span>
  )
}
