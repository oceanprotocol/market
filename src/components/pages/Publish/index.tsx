import React, { ReactElement } from 'react'
import { useNavigate } from '@reach/router'
import { toast } from 'react-toastify'
import { Formik } from 'formik'
import { usePublish } from '@oceanprotocol/react'
import styles from './index.module.css'
import PublishForm from './PublishForm'
import Web3Feedback from '../../molecules/Wallet/Feedback'
import { FormContent } from '../../../@types/Form'
import { initialValues, validationSchema } from '../../../models/FormPublish'
import { transformPublishFormToMetadata } from './utils'
import Preview from './Preview'
import { MetadataPublishForm } from '../../../@types/MetaData'
import { useUserPreferences } from '../../../providers/UserPreferences'
import { Logger, Metadata } from '@oceanprotocol/lib'
import Loader from '../../atoms/Loader'
import { Persist } from '../../atoms/FormikPersist'
import Debug from './Debug'

const formName = 'ocean-publish-form'

export default function PublishPage({
  content
}: {
  content: { form: FormContent }
}): ReactElement {
  const { debug } = useUserPreferences()
  const { publish, publishError, isLoading, publishStepText } = usePublish()
  const navigate = useNavigate()

  async function handleSubmit(
    values: Partial<MetadataPublishForm>,
    resetForm: () => void
  ): Promise<void> {
    const metadata = transformPublishFormToMetadata(values)
    const { price } = values
    const serviceType = values.access === 'Download' ? 'access' : 'compute'

    try {
      Logger.log('Publish with ', price, serviceType, price.datatoken)

      const ddo = await publish(
        (metadata as unknown) as Metadata,
        {
          ...price,
          swapFee: `${price.swapFee}`
        },
        serviceType,
        price.datatoken
      )

      if (publishError) {
        toast.error(publishError) && console.error(publishError)
        return null
      }

      // User feedback and redirect to new asset detail page
      ddo && toast.success('Asset created successfully.') && resetForm()
      // Go to new asset detail page
      navigate(`/asset/${ddo.id}`)
    } catch (error) {
      console.error(error.message)
      toast.error(error.message)
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      initialStatus="empty"
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        await handleSubmit(values, resetForm)
        setSubmitting(false)
      }}
    >
      {({ values }) => (
        <>
          <Persist name={formName} ignoreFields={['isSubmitting']} />

          {isLoading ? (
            <div className={styles.feedback}>
              <Loader message={publishStepText} />
            </div>
          ) : (
            <article className={styles.grid}>
              <PublishForm content={content.form} />
              <aside>
                <div className={styles.sticky}>
                  <Preview values={values} />
                  <Web3Feedback />
                </div>
              </aside>
            </article>
          )}

          {debug === true && <Debug values={values} />}
        </>
      )}
    </Formik>
  )
}
