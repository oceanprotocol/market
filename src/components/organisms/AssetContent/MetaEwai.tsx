import React, { ReactElement } from 'react'
import MetaItem from './MetaItem'
import styles from './MetaSecondary.module.css'
import Tags from '../../atoms/Tags'
import Button from '../../atoms/Button'
import { useAsset } from '../../../providers/Asset'
const highlight = require('cli-highlight').highlight
import { useStaticQuery, graphql } from 'gatsby'
import { EwaiInstanceQuery } from '../../../ewai/client/ewai-js'

export default function MetaEwai(): ReactElement {
  const { ewaiAsset } = useAsset()
  const data = useStaticQuery<EwaiInstanceQuery>(
    graphql`
      query EwaiInstance {
        ewai {
          ewaiInstance {
            name
          }
        }
      }
    `
  )

  return (
    <aside className={styles.metaSecondary}>
      <div>
        <p>EWNS:</p>
        <Tags items={[data.ewai.ewaiInstance.name, '=>', ewaiAsset?.ewns]} />
      </div>
      <div>
        <p>Output Data Format:</p>
        <Tags
          items={
            ewaiAsset?.defaultOutputFormat
              ? [ewaiAsset?.defaultOutputFormat]
              : []
          }
        />
      </div>
      <div>
        <p>Incoming Message Format:</p>
        <Tags items={[ewaiAsset?.incomingMsgFormat]} />
      </div>
      <div>
        <p>Data Publish Role Required:</p>
        <Tags items={[ewaiAsset?.dataPublishRole]} />
      </div>
      <div>
        <p>Schema Validation Enabled:</p>
        <Tags items={[ewaiAsset?.schemaValidationOn ? 'Yes' : 'No']} />
      </div>
      <div>
        <p>Message Schema (if any):</p>
        <textarea
          value={
            ewaiAsset?.msgSchema
              ? highlight(JSON.stringify(ewaiAsset.msgSchema, null, 4), {
                  language: 'json',
                  ignoreIllegals: true
                })
              : '{not set}'
          }
          rows={25}
          cols={60}
        />
      </div>
      <div>
        <p>Path to Message Timestamp:</p>
        <Tags items={[ewaiAsset?.pathToMsgTimestamp]} />
      </div>
    </aside>
  )
}
