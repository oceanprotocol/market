import React from 'react'
import Time from '../Time'
import Link from 'next/link'

export default function DdoLinkCell({ id, name }: { id: any; name: any }) {
  return (
    <Link href="/asset/[did]" as={`/asset/${id}`} passHref>
      <a>{name}</a>
    </Link>
  )
}
