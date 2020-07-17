import React, { ReactElement } from 'react'
import { useNavigate } from '@reach/router'
import PublishForm from './PublishForm'
import styles from './index.module.css'
import Web3Feedback from '../../molecules/Wallet/Feedback'
import { FormContent } from '../../../@types/Form'
import { Formik } from 'formik'
import { initialValues, validationSchema } from './validation'
import { usePublish } from '@oceanprotocol/react'
import { useSiteMetadata } from '../../../hooks/useSiteMetadata'
import { MetadataPublishForm } from '../../../@types/Metadata'
import { transformPublishFormToMetadata } from './utils'
import { toast } from 'react-toastify'

export default function PublishPage({
  content
}: {
  content: { form: FormContent }
}): ReactElement {
  const { publish, publishError } = usePublish()
  const navigate = useNavigate()
  const { marketAddress } = useSiteMetadata()

  async function handleSubmit(values: MetadataPublishForm): Promise<void> {
    console.log(`
      Collected form values:
      ----------------------
      ${JSON.stringify(values)}
    `)

    const metadata = transformPublishFormToMetadata(values)
    const tokensToMint = '4' // how to know this?
    const serviceType = values.access === 'Download' ? 'access' : 'compute'

    console.log(`
      Transformed metadata values:
      ----------------------
      ${JSON.stringify(metadata)}
      Cost: 1
      Tokens to mint: ${tokensToMint}
    `)

    try {
      const ddo = await publish(metadata as any, tokensToMint, marketAddress, [
        { serviceType, cost: '1' }
      ])

      if (publishError) {
        toast.error(publishError)
        return null
      }

      // User feedback and redirect to new asset detail page
      ddo && toast.success('Asset created successfully.')

      // TODO: reset form state and make sure persistant form in localStorage is cleared

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
                <Web3Feedback />
                <div className={styles.preview}>
                  <h2>{values.name}</h2>
                </div>
              </div>
            </aside>
          </>
        )}
      </Formik>
    </article>
  )
}
