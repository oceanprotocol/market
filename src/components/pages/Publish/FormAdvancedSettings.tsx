import React, {
  ReactElement,
  useEffect,
  FormEvent,
  ChangeEvent,
  useState
} from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { useFormikContext, Field, Form, FormikContextType } from 'formik'
import Input from '../../atoms/Input'
import { FormContent, FormFieldProps } from '../../../@types/Form'
import { ReactComponent as Caret } from '../../../images/caret.svg'
import FormTitle from './FormTitle'
import styles from './FormAdvancedSettings.module.css'
import Button from '../../atoms/Button'

import UserDataSchema from '../../molecules/FormFields/UserDataSchema'

const query = graphql`
  query {
    content: allFile(
      filter: {
        relativePath: { eq: "pages/publish/form-advanced-settings.json" }
      }
    ) {
      edges {
        node {
          childPublishJson {
            title
            data {
              name
              placeholder
              label
              type
              required
              sortOptions
              options
            }
          }
        }
      }
    }
  }
`

export default function FormAdvancedSettings(prop: {
  content: FormContent
  handleFieldChange: (
    e: ChangeEvent<HTMLInputElement>,
    field: FormFieldProps
  ) => void
}): ReactElement {
  const [multiselectOptionCounter, setMultiselectOptionCounter] =
    useState<number>(2)
  const [isOpen, setIsOpen] = useState<boolean>()

  const multiselectOptionObject = {
    name: `option${multiselectOptionCounter}`,
    label: `Multiselect option ${multiselectOptionCounter}`,
    type: 'text',
    required: true
  }

  const d = prop.content

  const data = useStaticQuery(query)
  const content: FormContent = data.content.edges[0].node.childPublishJson

  function addMultiselectOption() {}

  function toggleAdvancedSettingsSection(e: React.FormEvent<Element>) {
    !isOpen ? setIsOpen(true) : setIsOpen(false)
  }

  return (
    <div className={styles.formAdvancedSettings}>
      <div className={styles.advancedSettingsSection}>
        <FormTitle title="ADVANCED SETTINGS" showNetwork={false} />{' '}
        <Button
          style="text"
          size="small"
          onClick={toggleAdvancedSettingsSection}
          className={`${!isOpen ? styles.open : ''} ${styles.toggle}`}
        >
          <Caret />
        </Button>
      </div>

      <div
        className={`${styles.defineUserSchemaSubSection} ${
          isOpen ? styles.hideSection : ''
        }`}
      >
        <FormTitle title={content.title} showNetwork={false} />

        <UserDataSchema handleFieldChange={prop.handleFieldChange} />
        {/* Advanced Settings 2 */}
        {/* Advanced Settings 3 */}
        {/* Advanced Settings 4 */}
      </div>
    </div>
  )
}
