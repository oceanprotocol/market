import React from 'react'
import * as styles from './Box.module.css'
import { Center } from '../../../.storybook/helpers'

export default {
  title: 'Atoms/Box',
  decorators: [(storyFn: any) => <Center>{storyFn()}</Center>]
}

export const Normal = () => <div className={styles.box}>Hello Fancy Box</div>
