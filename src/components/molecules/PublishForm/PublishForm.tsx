import React, { useEffect, useState } from 'react'
import Form from '../../molecules/Form/index'
import {
  PublishFormSchema,
  PublishFormUiSchema,
  publishFormData,
  PublishFormDataInterface
} from '../../../models/PublishForm'
import useStoredValue from '../../../hooks/useStoredValue'
import { MetaDataDexFreight } from '../../../@types/MetaData'
import useOcean from '../../../hooks/useOcean'
import useWeb3 from '../../../hooks/useWeb3'
import { File, MetaData } from '@oceanprotocol/squid'
import { isBrowser, toStringNoMS } from '../../../utils'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import styles from './PublishForm.module.css'
import utils from 'web3-utils'
import AssetModel from '../../../models/Asset'

declare type PublishFormProps = {}

const FILES_DATA_LOCAL_STORAGE_KEY = 'filesData'
const PUBLISH_FORM_LOCAL_STORAGE_KEY = 'publishForm'

export function getFilesData() {
  let localFileData: File[] = []
  if (isBrowser) {
    const storedData = localStorage.getItem(FILES_DATA_LOCAL_STORAGE_KEY)
    if (storedData) {
      localFileData = localFileData.concat(JSON.parse(storedData) as File[])
    }
  }
  return localFileData
}

export function clearFilesData() {
  if (isBrowser)
    localStorage.setItem(FILES_DATA_LOCAL_STORAGE_KEY, JSON.stringify([]))
}

export function transformPublishFormToMetadata(
  data: PublishFormDataInterface
): MetaDataDexFreight {
  const currentTime = toStringNoMS(new Date())

  const {
    title,
    price,
    author,
    license,
    summary,
    category,
    holder,
    keywords,
    termsAndConditions,
    granularity,
    supportName,
    supportEmail,
    dateRange
  } = data

  const metadata: MetaDataDexFreight = {
    main: {
      ...AssetModel.main,
      name: title,
      price: utils.toWei(price.toString()),
      author,
      dateCreated: currentTime,
      datePublished: currentTime,
      files: getFilesData(),
      license
    },
    // ------- additional information -------
    additionalInformation: {
      ...AssetModel.additionalInformation,
      description: summary,
      categories: [category],
      copyrightHolder: holder,
      tags: keywords?.split(','),
      termsAndConditions,
      granularity,
      supportName,
      supportEmail
    },
    // ------- curation -------
    curation: {
      ...AssetModel.curation
    }
  }

  if (dateRange) {
    const newDateRange = JSON.parse(dateRange)
    if (newDateRange.length > 1) {
      metadata.additionalInformation.dateRange = JSON.parse(dateRange)
    } else if (newDateRange.length === 1) {
      // eslint-disable-next-line prefer-destructuring
      metadata.main.dateCreated = newDateRange[0]
    }
  }

  return metadata
}

const PublishForm: React.FC<PublishFormProps> = () => {
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const { web3, web3Connect } = useWeb3()
  const { ocean } = useOcean(web3)
  const router = useRouter()
  const [data, updateData] = useStoredValue(
    PUBLISH_FORM_LOCAL_STORAGE_KEY,
    publishFormData
  )

  useEffect(() => {
    setButtonDisabled(!ocean)
  }, [ocean])

  const handleChange = ({
    formData
  }: {
    formData: PublishFormDataInterface
  }) => {
    updateData(formData)
  }

  const handleSubmit = async ({
    formData
  }: {
    formData: PublishFormDataInterface
  }) => {
    setButtonDisabled(true)
    const submittingToast = toast.info('submitting asset', {
      className: styles.info
    })

    if (ocean == null) {
      await web3Connect.connect()
    }

    if (ocean) {
      const asset = await ocean.assets.create(
        (transformPublishFormToMetadata(formData) as unknown) as MetaData,
        (await ocean.accounts.list())[0]
      )

      // Reset the form to initial values

      updateData(publishFormData)
      clearFilesData()
      setButtonDisabled(false)
      // User feedback and redirect
      toast.success('asset created successfully', {
        className: styles.success
      })
      toast.dismiss(submittingToast)
      router.push(`/asset/${asset.id}`)
    }
  }

  const handleError = () =>
    toast.error('Please check form. There are some errors', {
      className: styles.error
    })

  return (
    <Form
      schema={PublishFormSchema}
      uiSchema={PublishFormUiSchema}
      formData={data}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onError={handleError}
      showErrorList={false}
      buttonDisabled={buttonDisabled}
    />
  )
}

export default PublishForm
