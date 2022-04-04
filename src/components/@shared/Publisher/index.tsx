import React, { ReactElement, useEffect, useState } from 'react'
import styles from './index.module.css'
import classNames from 'classnames/bind'
import Link from 'next/link'
import { accountTruncate } from '@utils/web3'
import axios from 'axios'
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
  const [accountEns, setAccountEns] = useState<string>()

  useEffect(() => {
    if (!account) return

    // set default name on hook
    // to avoid side effect (UI not updating on account's change)
    setName(accountTruncate(account))

    const source = axios.CancelToken.source()

    async function getExternalName() {
      // ENS
      const accountEns = await getEnsName(account)
      if (accountEns && isMounted()) {
        setAccountEns(accountEns)
        setName(accountEns)
      }
    }
    getExternalName()

    return () => {
      source.cancel()
    }
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
          <Link href={`/profile/${accountEns || account}`}>
            <a title="Show profile page.">{name}</a>
          </Link>
        </>
      )}
    </div>
  )
}
