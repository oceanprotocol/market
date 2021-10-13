import React, { ReactElement, useEffect, useState } from 'react'
import { useWeb3 } from '@context/Web3'
import rbacRequest from '@utils/rbac'
import Alert from '@shared/atoms/Alert'
import Loader from '@shared/atoms/Loader'
import { useIsMounted } from '@hooks/useIsMounted'
import { useSiteMetadata } from '@hooks/useSiteMetadata'

export default function Permission({
  eventType,
  children
}: {
  eventType: string
  children: ReactElement
}): ReactElement {
  const { appConfig } = useSiteMetadata()
  const url = appConfig?.rbacUrl
  const [data, updateData] = useState<boolean | 'ERROR'>()
  const [errorMessage, updateError] = useState<string>()
  const [messageState, updateMessageState] =
    useState<'error' | 'warning' | 'info' | 'success'>()
  const { accountId } = useWeb3()
  const isMounted = useIsMounted()

  useEffect(() => {
    if (url === '') return

    const controller = new AbortController()
    const getData = async () => {
      if (accountId === undefined) {
        updateError('Please make sure your wallet is connected to proceed.')
        updateMessageState('info')
      } else {
        const data = await rbacRequest(eventType, accountId, controller.signal)
        if (!isMounted()) return
        updateData(data)
        if (data === 'ERROR') {
          updateError(
            'There was an error verifying your permissions. Please refresh the page or conntact your network administrator'
          )
          updateMessageState('error')
        } else if (data === false) {
          updateError(
            `Sorry, you don't have permission to ${eventType}. Please make sure you have connected your registered address.`
          )
          updateMessageState('warning')
        } else if (data !== true) {
          updateError(
            'An unkown error occured. Please conntact your network administrator'
          )
          updateMessageState('error')
        }
      }
    }
    getData()
    return () => {
      controller.abort()
    }
  }, [eventType, accountId, url, isMounted])

  if (url === '' || data === true) {
    return <>{children}</>
  }

  return (
    <>
      <Alert text={errorMessage} state={messageState} />
      <br />
      <Loader />
    </>
  )
}
