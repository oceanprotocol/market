import React, { ReactElement } from 'react'
import Button from '../../atoms/Button'
import styles from './migration.module.css'
import { useMigrationStatus } from '../../../providers/Migration'

export default function CreateV4Pool(): ReactElement {
  const { didV4 } = useMigrationStatus()

  return (
    <Button
      style="primary"
      className={styles.button}
      onClick={() =>
        window.location.assign(
          `https://market.oceanprotocol.com/asset/${didV4}`
        )
      }
    >
      <span>View Asset on V4 Market</span>
    </Button>
  )
}
