import React, {
  ReactElement,
  useState,
  FormEvent,
  ChangeEvent,
  useEffect
} from 'react'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import { FormContent, FormFieldProps } from '../../../@types/Form'
import { Field } from 'formik'
import styles from './UserDataSchema.module.css'

import { useStaticQuery, graphql } from 'gatsby'
import { v4 as uuidv4 } from 'uuid'

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

interface IMultiselectOptionTemplate {
  optionid: string
  name: string
  label: string
  type: string
  required: boolean
}

interface IUserDataSchemaTemplate {
  userSchemaId: string
  fieldName: FormFieldProps
  fieldLabel: FormFieldProps
  fieldType: FormFieldProps
  isFieldRequired: FormFieldProps
  fieldDescription: FormFieldProps
  showMultiselectOptions: boolean
  multiselectOptions: IMultiselectOptionTemplate[]
}

export default function UserDataSchema(prop: {
  handleFieldChange: (
    e: ChangeEvent<HTMLInputElement>,
    field: FormFieldProps
  ) => void
}): ReactElement {
  const data = useStaticQuery(query)
  const content: FormContent = data.content.edges[0].node.childPublishJson

  const nameField = content.data.find((x) => x.name === 'fieldName')
  const labelField = content.data.find((x) => x.name === 'fieldLabel')
  const typeField = content.data.find((x) => x.name === 'fieldType')
  const isRequiredField = content.data.find((x) => x.name === 'fieldRequired')
  const descriptionField = content.data.find(
    (x) => x.name === 'fieldDescription'
  )

  const defaultMultiselectOptions = [
    {
      optionid: uuidv4(),
      name: `option1`,
      label: `Multiselect option 1`,
      type: 'text',
      required: true
    },
    {
      optionid: uuidv4(),
      name: `option1`,
      label: `Multiselect option 2`,
      type: 'text',
      required: true
    }
  ]

  const defaultUseDataSchema = {
    userSchemaId: uuidv4(),
    fieldName: nameField,
    fieldLabel: labelField,
    fieldType: typeField,
    isFieldRequired: isRequiredField,
    fieldDescription: descriptionField,
    showMultiselectOptions: false,
    multiselectOptions: defaultMultiselectOptions
  }

  const [userDataSchema, setUserDataSchema] = useState<
    IUserDataSchemaTemplate[]
  >([defaultUseDataSchema])

  function handleFieldChange(
    e: ChangeEvent<HTMLInputElement>,
    field: FormFieldProps,
    schemaId: string
  ) {
    if (field.name === 'fieldType') {
      if (e.target.value.toLowerCase() === 'select') {
        setUserDataSchema(
          userDataSchema.map((dataSchemaObject) =>
            dataSchemaObject.userSchemaId === schemaId
              ? { ...dataSchemaObject, showMultiselectOptions: true }
              : dataSchemaObject
          )
        )
      } else {
        setUserDataSchema(
          userDataSchema.map((dataSchemaObject) =>
            dataSchemaObject.userSchemaId === schemaId
              ? { ...dataSchemaObject, showMultiselectOptions: false }
              : dataSchemaObject
          )
        )
      }
    }

    if (field.name.includes('option')) {
    }
  }

  function addNewUserSchemaButton() {
    const userSchemaNextId = userDataSchema.length + 1

    const newUserSchema: IUserDataSchemaTemplate = {
      userSchemaId: uuidv4(),
      fieldName: nameField,
      fieldLabel: labelField,
      fieldType: typeField,
      isFieldRequired: isRequiredField,
      fieldDescription: descriptionField,
      showMultiselectOptions: false,
      multiselectOptions: [
        {
          optionid: uuidv4(),
          name: `option1`,
          label: `Multiselect option 1`,
          type: 'text',
          required: true
        },
        {
          optionid: uuidv4(),
          name: `option2`,
          label: `Multiselect option 2`,
          type: 'text',
          required: true
        }
      ]
    }

    setUserDataSchema((userSchemaList) => [...userSchemaList, newUserSchema])
  }

  function addMultiselectOption(userSchemaId: string) {
    const userSchema = userDataSchema.find(
      (x) => x.userSchemaId === userSchemaId
    )
    const numberOfMultiselectOptions = userSchema.multiselectOptions.length + 1

    setUserDataSchema(
      userDataSchema.map((dataSchemaObject, index) =>
        dataSchemaObject.userSchemaId === userSchemaId
          ? {
              ...dataSchemaObject,
              [index]: dataSchemaObject.multiselectOptions.push({
                optionid: uuidv4(),
                name: `option${numberOfMultiselectOptions}`,
                label: `Multiselect option ${numberOfMultiselectOptions}`,
                type: 'text',
                required: true
              })
            }
          : dataSchemaObject
      )
    )
  }

  function onDeleteUserDataSchemaButton(
    e: ChangeEvent<HTMLInputElement>,
    userSchemaId: string
  ) {
    const userSchemas = [...userDataSchema]
    const el = userSchemas.find((x) => x.userSchemaId === userSchemaId)
    const index = userSchemas.indexOf(el)

    if (index > -1) {
      userSchemas.splice(index, 1)
      setUserDataSchema(userSchemas)
    }
  }

  return (
    <div>
      {userDataSchema.map((x: IUserDataSchemaTemplate, index: number) => (
        <div className={styles.dataSchemaBox} key={x.userSchemaId}>
          <div className={styles.dataSchemaBox}>
            <div className={styles.dataSchemaNumeration}>
              <div className={styles.dataSchemaBorder} />
              <div className={styles.dataSchemaBorderNumber}>{index + 1}</div>
              <div className={styles.dataSchemaBorder} />
            </div>

            <div className={styles.fieldContainer}>
              <div className={styles.fieldsContainerRow}>
                <div className={styles.fieldsContainerColumn}>
                  <Field
                    key={x.fieldName.name}
                    {...x.fieldName}
                    options={x.fieldName.options}
                    component={Input}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleFieldChange(e, x.fieldName, x.userSchemaId)
                    }
                  />
                </div>
                <div className={styles.fieldsContainerColumn}>
                  <Field
                    key={x.fieldLabel.name}
                    {...x.fieldLabel}
                    options={x.fieldLabel.options}
                    component={Input}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleFieldChange(e, x.fieldLabel, x.userSchemaId)
                    }
                  />
                </div>
              </div>
              <div className={styles.fieldsContainerRow}>
                <div className={styles.fieldsContainerColumn}>
                  <Field
                    key={x.fieldType.name}
                    {...x.fieldType}
                    options={x.fieldType.options}
                    component={Input}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleFieldChange(e, x.fieldType, x.userSchemaId)
                    }
                  />
                </div>
                <div className={styles.fieldsContainerColumn}>
                  <Field
                    key={x.isFieldRequired.name}
                    {...x.isFieldRequired}
                    options={x.isFieldRequired.options}
                    component={Input}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleFieldChange(e, x.isFieldRequired, x.userSchemaId)
                    }
                  />
                </div>
              </div>
              <div className={styles.fieldsContainerRow}>
                {x.multiselectOptions.map(
                  (field: IMultiselectOptionTemplate) =>
                    x.showMultiselectOptions && (
                      <div className={styles.fieldsContainerColumn}>
                        <Field
                          key={field.optionid}
                          name={field.name}
                          {...field}
                          component={Input}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleFieldChange(e, field, x.userSchemaId)
                          }
                        />
                      </div>
                    )
                )}

                <div className={styles.fieldsContainerColumn}>
                  {x.showMultiselectOptions ? (
                    <Button
                      className={styles.addOptionButton}
                      style="text"
                      size="small"
                      onClick={() => addMultiselectOption(x.userSchemaId)}
                    >
                      ADD OPTION {x.multiselectOptions.length + 1}
                    </Button>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className={styles.fieldsContainerRow}>
                <div className={styles.fieldsContainerColumn}>
                  <Field
                    key={descriptionField.name}
                    {...descriptionField}
                    options={descriptionField.options}
                    component={Input}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleFieldChange(e, descriptionField, x.userSchemaId)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.break} />

          <div className={styles.deleteUserSchemaButton}>
            {userDataSchema.length > 1 ? (
              <Button
                style="text"
                size="small"
                onClick={(e: ChangeEvent<HTMLInputElement>) => {
                  onDeleteUserDataSchemaButton(e, x.userSchemaId)
                }}
                className={styles.deleteUserSchemaButton}
              >
                DELETE
              </Button>
            ) : (
              ''
            )}
            {index === userDataSchema.length - 1 ? (
              <Button
                style="text"
                size="small"
                onClick={addNewUserSchemaButton}
                className={styles.addNewUserSchemaButton}
              >
                ADD ANOTHER USER SCHEMA
              </Button>
            ) : (
              ''
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
