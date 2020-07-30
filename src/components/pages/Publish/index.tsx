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
import { MetadataPublishForm } from '../../../@types/Metadata'
import { transformPublishFormToMetadata } from './utils'
import Preview from './Preview'

export default function PublishPage({
  content
}: {
  content: { form: FormContent }
}): ReactElement {
  const { publish, publishError } = usePublish()
  const navigate = useNavigate()

  async function handleSubmit(values: MetadataPublishForm): Promise<void> {
    console.log(`
      Collected form values:
      ----------------------
      ${JSON.stringify(values, null, 2)}
    `)

    const metadata = transformPublishFormToMetadata(values)
    const { cost, tokensToMint } = values.price
    const serviceType = values.access === 'Download' ? 'access' : 'compute'

    console.log(`
      Transformed metadata values:
      ----------------------
      ${JSON.stringify(metadata, null, 2)}
      Cost: ${cost}
      Tokens to mint: ${tokensToMint}
    `)

    try {
      const ddo = await publish(metadata as any, tokensToMint.toString(), [
        { serviceType, cost: cost.toString() }
      ])

      if (publishError) {
        toast.error(publishError)
        return null
      }

      // User feedback and redirect to new asset detail page
      ddo && toast.success('Asset created successfully.')

      // TODO: reset form state and make sure persistant form in localStorage is cleared

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
        onSubmit={async (values, { setSubmitting }) => {
          await handleSubmit(values)
          setSubmitting(false)
        }}
      >
        {({ values }) => (
          <>
            <PublishForm content={content.form} />
            <aside>
              <div className={styles.sticky}>
                <Preview values={values} />
                <Web3Feedback />
              </div>
            </aside>
          </>
        )}
      </Formik>
    </article>
  )
}
