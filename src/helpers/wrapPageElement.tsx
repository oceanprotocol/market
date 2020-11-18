import React, { ReactElement } from 'react'
import Footer from '../components/organisms/Footer'
import Header from '../components/organisms/Header'
import Styles from '../global/Styles'
import styles from './app.module.css'

const wrapPageElement = ({
  element
}: {
  element: ReactElement
}): ReactElement => (
  <Styles>
    <div className={styles.app}>
      <Header />
      {element}
      <Footer />
    </div>
  </Styles>
)

export default wrapPageElement
