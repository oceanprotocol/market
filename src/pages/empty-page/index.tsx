import React, { ReactElement, useEffect, useState } from 'react'
import Page from '@shared/Page'
import { useRouter } from 'next/router'

export default function PageDiscover(): ReactElement {
  const router = useRouter()

  return (
    <Page uri={router.route} title="Empty Page" description="" noCategories>
      <div className="w-full flex justify-center">
        <span className="text-2xl">This page is not ready</span>
      </div>
    </Page>
  )
}
