import React, { ReactElement } from 'react'
import Menu from '../molecules/Menu'
import { header } from './Header.module.css'

export default function Header(): ReactElement {
  return (
    <header className={header}>
      <Menu />
    </header>
  )
}
