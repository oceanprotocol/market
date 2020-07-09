import React from 'react'
import { Link } from 'gatsby'

export default function DdoLinkCell({ id, name }: { id: any; name: any }) {
  return <Link to={`/asset/${id}`}>{name}</Link>
}
