import React, { ReactElement, useEffect, useState } from 'react'
import Page from '@shared/Page'
import { useRouter } from 'next/router'

export default function PageDiscover(): ReactElement {
  const router = useRouter()

  return (
    <Page uri={router.route} title="DISCOVER" description="Latest Data Pipline">
      ...
    </Page>
  )
}
