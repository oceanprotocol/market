import React, { useEffect, useState } from 'react'
import Form from '../../molecules/Form/index'
import {
  PublishFormSchema,
  PublishFormUiSchema,
  publishFormData,
  PublishFormDataInterface
} from '../../../models/PublishForm'
import useStoredValue from '../../../hooks/useStoredValue'
import { MetaDataMarket } from '../../../@types/MetaData'
import { File, MetaData } from '@oceanprotocol/squid'
import { isBrowser, toStringNoMS } from '../../../utils'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import styles from './PublishForm.module.css'
import utils from 'web3-utils'
import AssetModel from '../../../models/Asset'
import { useWeb3, useOcean } from '@oceanprotocol/react'
import {
  Service,
  ServiceCompute
} from '@oceanprotocol/squid/dist/node/ddo/Service'

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
): MetaDataMarket {
  const currentTime = toStringNoMS(new Date())

  const {
    title,
    price,
    author,
    license,
    summary,
    holder,
    keywords,
    termsAndConditions,
    supportName,
    supportEmail,
    dateRange,
    access
  } = data

  const metadata: MetaDataMarket = {
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
      copyrightHolder: holder,
      tags: keywords?.split(','),
      termsAndConditions,
      supportName,
      supportEmail,
      access: access || 'Download'
    },
    // ------- curation -------
    curation: AssetModel.curation
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
  const { web3Connect } = useWeb3()
  const { ocean, account } = useOcean()
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
      const metadata = transformPublishFormToMetadata(formData)

      // if services array stays empty, the default access service
      // will be created by squid-js
      let services: Service[] = []

      if (metadata.additionalInformation.access === 'Compute') {
        const computeService: ServiceCompute = await ocean.compute.createComputeServiceAttributes(
          account,
          metadata.main.price,
          // Note: a hack without consequences.
          // Will make metadata.main.datePublished (automatically created by Aquarius)
          // go out of sync with this service.main.datePublished.
          toStringNoMS(new Date(Date.now()))
        )
        services = [computeService]
      }
      try {
        const asset = await ocean.assets.create(
          (metadata as unknown) as MetaData,
          account,
          services
        )

        // Reset the form to initial values

        updateData(publishFormData)
        clearFilesData()

        // User feedback and redirect
        toast.success('asset created successfully', {
          className: styles.success
        })
        toast.dismiss(submittingToast)
        router.push(`/asset/${asset.id}`)
      } catch (e) {
        console.log(e)
      } finally {
        setButtonDisabled(false)
      }

      // Reset the form to initial values

      // User feedback and redirect
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
