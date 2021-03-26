import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import styles from './FormComputeDataset.module.css'
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'
import { FormFieldProps } from '../../../../@types/Form'
import { useOcean } from '../../../../providers/Ocean'
import { useStaticQuery, graphql } from 'gatsby'
import { DDO, publisherTrustedAlgorithm } from '@oceanprotocol/lib'
import { AssetSelectionAsset } from '../../../molecules/FormFields/AssetSelection'

const contentQuery = graphql`
  query StartComputeDatasetQuery {
    content: allFile(
      filter: { relativePath: { eq: "pages/startComputeDataset.json" } }
    ) {
      edges {
        node {
          childPagesJson {
            description
            form {
              success
              successAction
              error
              data {
                name
                label
                help
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
  }
`

export default function FromStartCompute({
  algorithms,
  ddoListAlgorithms,
  selectedAlgorithm,
  setselectedAlgorithm,
  loading
}: {
  algorithms: AssetSelectionAsset[]
  ddoListAlgorithms: DDO[]
  selectedAlgorithm: DDO
  setselectedAlgorithm: React.Dispatch<React.SetStateAction<DDO>>
  loading: boolean
}): ReactElement {
  const data = useStaticQuery(contentQuery)
  const content = data.content.edges[0].node.childPagesJson

  const {
    isValid,
    validateField,
    setFieldValue
  }: FormikContextType<string> = useFormikContext()

  function getAlgorithmAsset(algorithmId: string): DDO {
    let assetDdo = null
    ddoListAlgorithms.forEach((ddo: DDO) => {
      if (ddo.id === algorithmId) assetDdo = ddo
    })
    return assetDdo
  }

  function handleFieldChange(
    e: ChangeEvent<HTMLSelectElement>,
    field: FormFieldProps
  ) {
    setFieldValue(field.name, e.target.id)
    validateField(field.name)
    setselectedAlgorithm(getAlgorithmAsset(e.target.id))
  }

  return (
    <Form className={styles.form}>
      {content.form.data.map((field: FormFieldProps) => (
        <Field
          key={field.name}
          {...field}
          options={algorithms}
          component={Input}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            handleFieldChange(e, field)
          }
        />
      ))}

      <footer className={styles.actions}>
        <div className={styles.actions}>
          <Button
            style="primary"
            type="submit"
            // disabled={isComputeButtonDisabled}
          >
            Start compute job
          </Button>
        </div>
      </footer>
    </Form>
  )
}
