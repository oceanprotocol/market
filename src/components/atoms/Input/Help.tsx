import React, { ReactElement } from 'react'
import styles from './Help.module.css'
import Markdown from '../Markdown'

const FormHelp = ({ children }: { children: string }): ReactElement => (
  <Markdown className={styles.help} text={children} />
)

export default FormHelp
