import React, { ReactElement, useState, useEffect } from 'react'
import Container from '../../atoms/Container'
import Button from '../../atoms/Button'
import Alert from '../../atoms/Alert'
import styles from './startMigration.module.css'

function startMigration() {
  console.log('Start Migration Clicked')
}

export default function StartMigration(): ReactElement {
  return (
    <Container className={styles.container}>
      <Alert
        text="**Time to migrate from V3 to V4** \n\nAs the asset publisher you can initiate the migration from a V3 pool to
        a V4 pool. \n\nThe migration requires 80% of liquidity providers to lock their shares in the migration contract."
        state="info"
        action={{
          name: 'Start Migration',
          handleAction: () => startMigration()
        }}
      />
    </Container>
  )
}
