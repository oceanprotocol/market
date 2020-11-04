import React, { ReactElement } from 'react'
import { ReactComponent as PartnerIcon } from '../../images/partner.svg'
import styles from './Partner.module.css'
import classNames from 'classnames/bind'
import Tooltip from './Tooltip'

const cx = classNames.bind(styles)

export interface PartnerData {
  name: string
  accounts: string[]
  links: {
    [key: string]: string
  }
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
      <Tooltip content="Ocean Protocol Data Partner">
        <span className={styles.badge}>
          <PartnerIcon />
        </span>
        {partner.name}
      </Tooltip>
    </span>
  )
}
