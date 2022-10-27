import React, { ReactElement } from 'react'
import Link from 'next/link'
import { TabsItem } from '../../slices/tabs'
import { useRouter } from 'next/router'

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

declare type TabItemProps = {
  item: TabsItem
}

export default function TabItem({ item }: TabItemProps): ReactElement {
  const router = useRouter()
  const isHighlight = router.asPath === item.url

  return (
    <Link key={item.title} href={router.asPath + '/' + item.url}>
      <a
        className={classNames(
          isHighlight
            ? 'text-blue-500 border-b-2 border-blue-500'
            : 'text-white hover:text-blue-300 hover:border-b-2 hover:border-blue-300'
        )}
      >
        {item.title}
      </a>
    </Link>
  )
}
