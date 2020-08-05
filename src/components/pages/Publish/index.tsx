import React, { ReactElement } from 'react'
import { useNavigate } from '@reach/router'
import { toast } from 'react-toastify'
import { Formik } from 'formik'
import { usePublish, useOcean } from '@oceanprotocol/react'
import styles from './index.module.css'
import PublishForm from './PublishForm'
import Web3Feedback from '../../molecules/Wallet/Feedback'
import { FormContent } from '../../../@types/Form'
import { initialValues, validationSchema } from '../../../models/FormPublish'
import { transformPublishFormToMetadata } from './utils'
import Preview from './Preview'
import { MetadataPublishForm } from '../../../@types/MetaData'

export default function PublishPage({
  content
}: {
  content: { form: FormContent }
}): ReactElement {
  const { accountId, ocean } = useOcean()
  const { publish, publishError } = usePublish()
  const navigate = useNavigate()

  async function handleSubmit(values: MetadataPublishForm): Promise<void> {
    console.log(`
      Collected form values:
      ----------------------
      ${JSON.stringify(values, null, 2)}
    `)

    const metadata = transformPublishFormToMetadata(values)
    const { tokensToMint, type } = values.price
    const serviceType = values.access === 'Download' ? 'access' : 'compute'

    console.log(`
      Transformed metadata values:
      ----------------------
      ${JSON.stringify(metadata, null, 2)}
      Tokens to mint: ${tokensToMint}
    `)

    try {
      // mpAddress and mpFee are not yet implemented in ocean js so are not uset
      const ddo = await publish(
        metadata as any,
        tokensToMint.toString(),
        serviceType,
        '',
        ''
      )

      // create pool for the data token, this is the advanced flow , currently hardcoded
      const pool = await ocean.pool.createDTPool(
        accountId,
        ddo.dataToken,
        tokensToMint.toString(),
        '9',
        '0.03'
      )
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
      </Formik>
    </article>
  )
}
