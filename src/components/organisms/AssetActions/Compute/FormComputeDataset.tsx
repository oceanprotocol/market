import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import styles from './FormComputeDataset.module.css'
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'
import Loader from '../../../atoms/Loader'
import { FormFieldProps } from '../../../../@types/Form'
import { ServiceComputePrivacy, DDO } from '@oceanprotocol/lib'
import { useCompute, useOcean } from '@oceanprotocol/react'
import { useStaticQuery, graphql } from 'gatsby'
import { queryMetadata, getAssetsNames } from '../../../../utils/aquarius'
import axios from 'axios'
import web3 from 'web3'

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
  algorithmList,
  setAlgorithmsList,
  loading
}: {
  algorithmList: DDO[]
  setAlgorithmsList: React.Dispatch<React.SetStateAction<DDO[]>>
  loading: boolean
}): ReactElement {
  const data = useStaticQuery(contentQuery)
  const content = data.content.edges[0].node.childPagesJson

  const {
    isValid,
    validateField,
    setFieldValue
  }: FormikContextType<string> = useFormikContext()
  const { config } = useOcean()
  const { computeStepText } = useCompute()

  function handleFieldChange(
    e: ChangeEvent<HTMLSelectElement>,
    field: FormFieldProps
  ) {
    // hack there's an issue with value on input type radio
    setFieldValue(field.name, e.target.id)
    validateField(field.name)
  }

  // must be moved to a util method used also on edit compute metadata
  async function getAlgorithms() {
    const query = {
      page: 1,
      query: {
        nativeSearch: 1,
        query_string: {
          query: `(service.attributes.main.type:algorithm) -isInPurgatory:true`
        }
      },
      sort: { created: -1 }
    }

    const source = axios.CancelToken.source()
    const didList: string[] = []
    const priceList: any = {}
    const result = await queryMetadata(
      query as any,
      config.metadataCacheUri,
      source.token
    )

    setAlgorithmsList(result.results)
    result.results.forEach((ddo: DDO) => {
      const did: string = web3.utils
        .toChecksumAddress(ddo.dataToken)
        .replace('0x', 'did:op:')
      didList.push(did)
      priceList[did] = ddo.price.value
    })

    console.log('result', result)
    const ddoNames = await getAssetsNames(
      didList,
      config.metadataCacheUri,
      source.token
    )

    content.form.data[0].options = []
    didList.forEach((did: string) => {
      content.form.data[0].options.push({
        did: did,
        name: ddoNames[did],
        price: priceList[did]
      })
    })
  }

  useEffect(() => {
    getAlgorithms()
  }, [])

  return (
    <Form className={styles.form}>
      {content.form.data.map((field: FormFieldProps) => (
        <Field
          key={field.name}
          {...field}
          component={Input}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            handleFieldChange(e, field)
          }
        />
      ))}

      <footer className={styles.actions}>
        <div className={styles.actions}>
          {loading ? (
            <Loader message={computeStepText} />
          ) : (
            <Button
              style="primary"
              type="submit"
              // disabled={isComputeButtonDisabled}
            >
              Start compute job
            </Button>
          )}
        </div>
      </footer>
    </Form>
  )
}
