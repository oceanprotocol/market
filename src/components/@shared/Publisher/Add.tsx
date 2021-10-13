import React, { ReactElement } from 'react'
<<<<<<< HEAD:src/components/@shared/Publisher/Add.tsx
import External from '@images/external.svg'
=======
import { ReactComponent as External } from '@images/external.svg'
>>>>>>> 14d71ad2 (reorganize all the things):src/components/@shared/atoms/Publisher/Add.tsx
import styles from './Add.module.css'

export default function Add(): ReactElement {
  return (
    <a
      className={styles.add}
      href="https://www.3box.io/hub"
      target="_blank"
      rel="noreferrer"
    >
      Add profile on 3Box <External className={styles.linksExternal} />
    </a>
  )
}
