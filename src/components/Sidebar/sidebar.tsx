import React, { Fragment, useState } from 'react'

import { useAppSelector } from '../../store'
import SidebarItem from './item'

import { CaretDoubleRight, Logo } from '../../assets/images/icons'

const Sidebar: React.FC = () => {
  const navigation = useAppSelector((state) => state.navigation)

  return (
    <div className="w-14 md:fixed md:inset-y-0 md:flex md:flex-col">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex flex-shrink-0 items-center px-4">
            <Logo className="h-8 w-auto" />
          </div>

          <nav className="mt-10 flex-1 space-y-1 px-2">
            {navigation.map((item) => (
              <SidebarItem key={item.title} item={item} />
            ))}
          </nav>
        </div>

        <div className="flex flex-shrink-0 p-4">
          <div className="group block w-full flex-shrink-0">
            <CaretDoubleRight
              className="inline-block h-6 w-6 rounded-full cursor-pointer"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
