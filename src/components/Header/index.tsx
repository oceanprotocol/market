import React, { ReactElement } from 'react'
import Menu from './Menu'
<<<<<<< HEAD:src/components/Header/index.tsx
import styles from './index.module.css'
=======
import styles from './Header.module.css'
>>>>>>> 14d71ad2 (reorganize all the things):src/components/Header/Header.tsx

export default function Header(): ReactElement {
  return (
    <header className={styles.header}>
      <Menu />
    </header>
  )
}
