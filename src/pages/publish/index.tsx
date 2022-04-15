import { ReactElement } from 'react'
import { useRouter } from 'next/router'

export default function PagePublish(): ReactElement {
  const router = useRouter()
  // Redirect to step 1 if landed in '/publish'
  router.push(`${router.pathname}/1`)
  return null
}
