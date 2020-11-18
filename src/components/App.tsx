import React, { ReactElement } from 'react'
import Footer from './organisms/Footer'
import Header from './organisms/Header'
import Styles from '../global/Styles'
import styles from './App.module.css'
import { useSiteMetadata } from '../hooks/useSiteMetadata'
import { useOcean } from '@oceanprotocol/react'
import Alert from './atoms/Alert'
import { PageProps } from 'gatsby'

export default function App({
  children,
  ...props
}: {
  children: ReactElement
}): ReactElement {
  const { warning } = useSiteMetadata()
  const {
    isInPurgatory: isAccountInPurgatory,
    purgatoryData: accountPurgatory
  } = useOcean()

  return (
    <Styles>
      <div className={styles.app}>
        <Header />

        {(props as PageProps).uri === '/' && (
          <Alert text={warning} state="info" />
        )}

        {isAccountInPurgatory && accountPurgatory && (
          <Alert
            title="Account In Purgatory"
            badge={`Reason: ${accountPurgatory.reason}`}
            text="No further actions are permitted by this account. For more details go to [list-purgatory](https://github.com/oceanprotocol/list-purgatory)."
            state="error"
          />
        )}

        <main className={styles.main}>{children}</main>
        <Footer />
      </div>
    </Styles>
  )
}
