import React, { ReactElement } from 'react'
import Footer from '../components/organisms/Footer'
import Header from '../components/organisms/Header'
import Styles from '../global/Styles'
import styles from './App.module.css'

const App = ({ children }: { children: ReactElement }): ReactElement => (
  <Styles>
    <div className={styles.app}>
      <Header />
      {children}
      <Footer />
    </div>
  </Styles>
)

export default App
