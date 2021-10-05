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

  const nameField = content.data.find((field) => field.name === 'fieldName')
  const labelField = content.data.find((field) => field.name === 'fieldLabel')
  const typeField = content.data.find((field) => field.name === 'fieldType')
  const isRequiredField = content.data.find(
    (field) => field.name === 'fieldRequired'
  )
  const descriptionField = content.data.find(
    (field) => field.name === 'fieldDescription'
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
      (userSchema) => userSchema.userSchemaId === userSchemaId
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
    const index = userSchemas.indexOf(
      userSchemas.find((userSchema) => userSchema.userSchemaId === userSchemaId)
    )

    if (index > -1) {
      userSchemas.splice(index, 1)
      setUserDataSchema(userSchemas)
    }
  }

  return (
    <div>
      {userDataSchema.map(
        (userSchema: IUserDataSchemaTemplate, index: number) => (
          <div className={styles.dataSchemaBox} key={userSchema.userSchemaId}>
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
                      key={userSchema.fieldName.name}
                      {...userSchema.fieldName}
                      options={userSchema.fieldName.options}
                      component={Input}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleFieldChange(
                          e,
                          userSchema.fieldName,
                          userSchema.userSchemaId
                        )
                      }
                    />
                  </div>
                  <div className={styles.fieldsContainerColumn}>
                    <Field
                      key={userSchema.fieldLabel.name}
                      {...userSchema.fieldLabel}
                      options={userSchema.fieldLabel.options}
                      component={Input}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleFieldChange(
                          e,
                          userSchema.fieldLabel,
                          userSchema.userSchemaId
                        )
                      }
                    />
                  </div>
                </div>
                <div className={styles.fieldsContainerRow}>
                  <div className={styles.fieldsContainerColumn}>
                    <Field
                      key={userSchema.fieldType.name}
                      {...userSchema.fieldType}
                      options={userSchema.fieldType.options}
                      component={Input}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleFieldChange(
                          e,
                          userSchema.fieldType,
                          userSchema.userSchemaId
                        )
                      }
                    />
                  </div>
                  <div className={styles.fieldsContainerColumn}>
                    <Field
                      key={userSchema.isFieldRequired.name}
                      {...userSchema.isFieldRequired}
                      options={userSchema.isFieldRequired.options}
                      component={Input}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleFieldChange(
                          e,
                          userSchema.isFieldRequired,
                          userSchema.userSchemaId
                        )
                      }
                    />
                  </div>
                </div>
                <div className={styles.fieldsContainerRow}>
                  {userSchema.multiselectOptions.map(
                    (optionField: IMultiselectOptionTemplate) =>
                      userSchema.showMultiselectOptions && (
                        <div className={styles.fieldsContainerColumn}>
                          <Field
                            key={optionField.optionid}
                            name={optionField.name}
                            {...optionField}
                            component={Input}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              handleFieldChange(
                                e,
                                optionField,
                                userSchema.userSchemaId
                              )
                            }
                          />
                        </div>
                      )
                  )}

                  <div className={styles.fieldsContainerColumn}>
                    {userSchema.showMultiselectOptions ? (
                      <Button
                        className={styles.addOptionButton}
                        style="text"
                        size="small"
                        onClick={() =>
                          addMultiselectOption(userSchema.userSchemaId)
                        }
                      >
                        ADD OPTION {userSchema.multiselectOptions.length + 1}
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
                        handleFieldChange(
                          e,
                          descriptionField,
                          userSchema.userSchemaId
                        )
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
                    onDeleteUserDataSchemaButton(e, userSchema.userSchemaId)
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
        )
      )}
    </div>
  )
}
