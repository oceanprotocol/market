import React, { ReactElement, useState, useEffect } from 'react'
import Container from '../../atoms/Container'
import Button from '../../atoms/Button'
import Alert from '../../atoms/Alert'

function startMigration() {
  console.log('Start Migration Clicked')
}

export default function StartMigration(): ReactElement {
  return (
    <Container>
      <Alert
        text="As the asset publisher you can initiate the migration from a V3 pool to
        a V4 pool"
        state="info"
        action={{
          name: 'Start Migration',
          handleAction: () => startMigration()
        }}
      />
    </Container>
  )
}
