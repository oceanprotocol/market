import React, { ReactElement } from 'react'
import Button from '../../atoms/Button'
import styles from './migration.module.css'
import { useMigrationStatus } from '../../../providers/Migration'

export default function CreateV4Pool(): ReactElement {
  const { didV4 } = useMigrationStatus()

  const V4_MARKET_URL = 'https://market-git-v4-oceanprotocol.vercel.app/'

  return (
    <Button
      style="primary"
      className={styles.button}
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      onClick={() => window.open(`${V4_MARKET_URL}/asset/${didV4}`, '_blank')}
    >
      <span>View Asset on V4 Market</span>
    </Button>
  )
}
