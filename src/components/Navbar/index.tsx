import React, { ReactElement, Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { useAppSelector } from '../../store'
import { NavigationItem } from '../../slices/navigation'
import Search from './Search'
import { BellIcon, UserIcon } from '../../assets/images/icons'

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar(): ReactElement {
  const userNavigation = useAppSelector((state) => state.navigation.user)

  return (
    <div className="flex justify-between h-16 bg-gray-800 border-b-2 border-gray-600">
      <div className="w-2/5 flex items-center pl-4">
        <Search />
      </div>

      <div className="pr-4 ml-4 flex items-center md:ml-6">
        <button
          type="button"
          className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <span className="sr-only">View notifications</span>
          <BellIcon className="w-6 h-6" />
        </button>

        {/* Profile dropdown */}
        <Menu as="div" className="relative ml-3">
          <div>
            <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <span className="sr-only">Open user menu</span>
              <UserIcon className="h-6 w-6" />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {userNavigation.map((item: NavigationItem) => (
                <Menu.Item key={item.title}>
                  {({ active }) => (
                    <a
                      href={item.url}
                      className={classNames(
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700'
                      )}
                    >
                      {item.title}
                    </a>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  )
}
