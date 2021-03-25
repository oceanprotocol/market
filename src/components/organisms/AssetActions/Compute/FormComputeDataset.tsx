import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import styles from './FormComputeDataset.module.css'
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'
import { FormFieldProps } from '../../../../@types/Form'
import { useOcean } from '../../../../providers/Ocean'
import { useStaticQuery, graphql } from 'gatsby'
import { queryMetadata, getAssetsNames } from '../../../../utils/aquarius'
import axios from 'axios'
import web3 from 'web3'
import {
  DDO,
  ServiceComputePrivacy,
  publisherTrustedAlgorithm
} from '@oceanprotocol/lib'
import { exportDefaultSpecifier } from '@babel/types'

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
  ddo,
  selectedAlgorithm,
  setselectedAlgorithm,
  loading
}: {
  ddo: DDO
  selectedAlgorithm: DDO
  setselectedAlgorithm: React.Dispatch<React.SetStateAction<DDO>>
  loading: boolean
}): ReactElement {
  const data = useStaticQuery(contentQuery)
  const content = data.content.edges[0].node.childPagesJson
  const [algorithms, setAlgorithms] = useState<DDO[]>()

  const {
    isValid,
    validateField,
    setFieldValue
  }: FormikContextType<string> = useFormikContext()
  const { config } = useOcean()

  function getAlgorithmAsset(algorithmId: string): DDO {
    let assetDdo = null
    algorithms.forEach((ddo: DDO) => {
      if (ddo.id === algorithmId) assetDdo = ddo
    })
    return assetDdo
  }

  function handleFieldChange(
    e: ChangeEvent<HTMLSelectElement>,
    field: FormFieldProps
  ) {
    // hack there's an issue with value on input type radio
    setFieldValue(field.name, e.target.id)
    validateField(field.name)
    setselectedAlgorithm(getAlgorithmAsset(e.target.id))
  }

  function getQuerryString(
    trustedAlgorithmList: publisherTrustedAlgorithm[]
  ): string {
    let algoQuerry = ''
    trustedAlgorithmList.forEach((trusteAlgo) => {
      algoQuerry += `id:"${trusteAlgo.did}" OR `
    })
    if (trustedAlgorithmList.length > 1) {
      algoQuerry = algoQuerry.substring(0, algoQuerry.length - 3)
    }
    const algorithmQuery =
      trustedAlgorithmList.length > 0 ? `(${algoQuerry}) AND` : ``
    return algorithmQuery
  }

  // must be moved to a util method used also on edit compute metadata
  async function getAlgorithms() {
    const computeService = ddo.findServiceByType('compute')

    if (
      computeService.attributes.main.privacy.publisherTrustedAlgorithms
        .length === 0 &&
      !computeService.attributes.main.privacy.allowAllPublishedAlgorithms
    ) {
      setAlgorithms([])
    } else {
      const algoQuery = computeService.attributes.main.privacy
        .allowAllPublishedAlgorithms
        ? ''
        : getQuerryString(
            computeService.attributes.main.privacy.publisherTrustedAlgorithms
          )
      const query = {
        page: 1,
        query: {
          query_string: {
            query: `${algoQuery} service.attributes.main.type:algorithm AND price.type:exchange -isInPurgatory:true`
          }
        },
        sort: { 'price.value': -1 }
      }

      const source = axios.CancelToken.source()
      const didList: string[] = []
      const priceList: any = {}
      const result = await queryMetadata(
        query as any,
        config.metadataCacheUri,
        source.token
      )

      setAlgorithms(result.results)
      result.results.forEach((ddo: DDO) => {
        const did: string = web3.utils
          .toChecksumAddress(ddo.dataToken)
          .replace('0x', 'did:op:')
        didList.push(did)
        priceList[did] = ddo.price.value
      })

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
