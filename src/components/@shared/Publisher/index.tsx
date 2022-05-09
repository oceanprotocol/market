import React, { ReactElement, useEffect, useState } from 'react'
import styles from './index.module.css'
import classNames from 'classnames/bind'
import Link from 'next/link'
import { accountTruncate } from '@utils/web3'
import { getEnsName } from '@utils/ens'
import { useIsMounted } from '@hooks/useIsMounted'

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
  const isMounted = useIsMounted()
  const [name, setName] = useState('')

  useEffect(() => {
    if (!account) return

    // set default name on hook
    // to avoid side effect (UI not updating on account's change)
    setName(accountTruncate(account))

    async function getExternalName() {
      const accountEns = await getEnsName(account)
      if (accountEns && isMounted()) {
        setName(accountEns)
      }
    }
    getExternalName()
  }, [account, isMounted])

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
          <Link href={`/profile/${account}`}>
            <a title="Show profile page.">{name}</a>
          </Link>
        </>
      )}
    </div>
  )
}
