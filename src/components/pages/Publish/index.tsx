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
import { useSiteMetadata } from '../../../hooks/useSiteMetadata'

export default function PublishPage({
  content
}: {
  content: { form: FormContent }
}): ReactElement {
  const { marketFeeAddress, marketFeeAmount } = useSiteMetadata()
  const { accountId, ocean } = useOcean()
  const { publish, publishError,isLoading,publishStepText } = usePublish()
  const navigate = useNavigate()

  async function handleSubmit(
    values: MetadataPublishForm,
    resetForm: () => void
  ): Promise<void> {
    // console.log(`
    //   Collected form values:
    //   ----------------------
    //   ${JSON.stringify(values, null, 2)}
    // `)

    const metadata = transformPublishFormToMetadata(values)
    const {
      tokensToMint,
      type,
      weightOnDataToken,
      liquidityProviderFee
    } = values.price
    const serviceType = values.access === 'Download' ? 'access' : 'compute'

    // console.log(`
    //   Transformed metadata values:
    //   ----------------------
    //   ${JSON.stringify(metadata, null, 2)}
    //   Tokens to mint: ${tokensToMint}
    // `)

    try {
      // mpAddress and mpFee are not yet implemented in ocean js so are not uset
      const ddo = await publish(
        metadata as any,
        tokensToMint.toString(),
        serviceType,
        marketFeeAddress,
        marketFeeAmount
      )
      switch (type) {
        case 'advanced': {
          // weight is hardcoded at 9 (90%) and publisher fee at 0.03(this was a random value set by me)
          const pool = await ocean.pool.createDTPool(
            accountId,
            ddo.dataToken,
            tokensToMint.toString(),
            weightOnDataToken,
            liquidityProviderFee
          )
        }
      }

      if (publishError) {
        toast.error(publishError)
        return null
      }

      // User feedback and redirect to new asset detail page
      ddo && toast.success('Asset created successfully.')

      // reset form state
      // TODO: verify persistant form in localStorage is cleared with it too
      resetForm()

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
            <PublishForm content={content.form} isLoading={isLoading} publishStepText={publishStepText} />
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
