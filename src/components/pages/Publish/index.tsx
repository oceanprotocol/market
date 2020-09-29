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
import { MetadataMarket, MetadataPublishForm } from '../../../@types/MetaData'
import { useUserPreferences } from '../../../providers/UserPreferences'
import { Logger, Metadata } from '@oceanprotocol/lib'

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
    <article className={styles.grid}>
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
            <PublishForm
              content={content.form}
              isLoading={isLoading}
              publishStepText={publishStepText}
            />
            <aside>
              <div className={styles.sticky}>
                <Preview values={values} />
                <Web3Feedback />
              </div>
            </aside>

            {debug === true && (
              <>
                <div>
                  <h5>Collected Form Values</h5>
                  <pre>
                    <code>{JSON.stringify(values, null, 2)}</code>
                  </pre>
                </div>

                <div>
                  <h5>Transformed Values</h5>
                  <pre>
                    <code>
                      {JSON.stringify(
                        transformPublishFormToMetadata(values),
                        null,
                        2
                      )}
                    </code>
                  </pre>
                </div>
              </>
            )}
          </>
        )}
      </Formik>
    </article>
  )
}
