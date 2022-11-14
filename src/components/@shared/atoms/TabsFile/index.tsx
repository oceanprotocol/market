import Label from '@shared/FormInput/Label'
import Markdown from '@shared/Markdown'
import { useFormikContext } from 'formik'
import React, { ReactElement, ReactNode, useEffect } from 'react'
import { Tab, Tabs as ReactTabs, TabList, TabPanel } from 'react-tabs'
import { FormPublishData } from 'src/components/Publish/_types'
import Tooltip from '../Tooltip'
import styles from './index.module.css'

export interface TabsItem {
  field: any
  title: string
  content: ReactNode
  disabled?: boolean
  props: any
}

export interface TabsProps {
  items: TabsItem[]
  className?: string
  handleTabChange?: (tabName: string) => void
  defaultIndex?: number
}

export default function TabsFile({
  items,
  className,
  handleTabChange,
  defaultIndex
}: TabsProps): ReactElement {
  const { setFieldValue } = useFormikContext<FormPublishData>()

  useEffect(() => {
    console.log(items[defaultIndex].props.name, items[defaultIndex].field.value)

    setFieldValue(`${items[defaultIndex].props.name}[0]`, {
      url: '',
      type: items[defaultIndex].field.value
    })
  }, [defaultIndex])

  return (
    <ReactTabs className={`${className || ''}`} defaultIndex={defaultIndex}>
      <div className={styles.tabListContainer}>
        <TabList className={styles.tabList}>
          {items.map((item, index) => (
            <Tab
              className={styles.tab}
              key={index}
              onClick={
                handleTabChange ? () => handleTabChange(item.title) : null
              }
              disabled={item.disabled}
            >
              {item.title}
            </Tab>
          ))}
        </TabList>
      </div>
      <div className={styles.tabContent}>
        {items.map((item, index) => {
          return (
            <>
              <TabPanel key={index}>
                <label className={styles.tabLabel}>
                  {item.field.label}
                  {item.field.required && (
                    <span title="Required" className={styles.required}>
                      *
                    </span>
                  )}
                  {item.field.help && item.field.prominentHelp && (
                    <Tooltip content={<Markdown text={item.field.help} />} />
                  )}
                </label>
                {item.content}
              </TabPanel>
            </>
          )
        })}
      </div>
    </ReactTabs>
  )
}
