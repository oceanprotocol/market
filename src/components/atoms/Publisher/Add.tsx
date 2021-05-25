import React, { ReactElement } from 'react'
import { ReactComponent as External } from '../../../images/external.svg'
import { add, linksExternal } from './Add.module.css'

export default function Add(): ReactElement {
  return (
    <a
      className={add}
      href="https://www.3box.io/hub"
      target="_blank"
      rel="noreferrer"
    >
      Add profile on 3Box <External className={linksExternal} />
    </a>
  )
}
