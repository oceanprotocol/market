import React from 'react'
import { File } from '@oceanprotocol/squid'
import { prettySize } from '../../../../utils'
import cleanupContentType from '../../../../utils/cleanupContentType'
import styles from './Info.module.css'

const FileInfo = ({ info, removeItem }: { info: File; removeItem(): void }) => (
  <div className={styles.info}>
    <h3 className={styles.url}>{info.url}</h3>
    <ul>
      <li>URL confirmed</li>
      {info.contentLength && <li>{prettySize(+info.contentLength)}</li>}
      {info.contentType && <li>{cleanupContentType(info.contentType)}</li>}
    </ul>
    <button className={styles.removeButton} onClick={() => removeItem()}>
      &times;
    </button>
  </div>
)

export default FileInfo
