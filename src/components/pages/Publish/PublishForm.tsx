import React, { ReactElement } from 'react'
import { useNavigate } from '@reach/router'
import { toast } from 'react-toastify'
import styles from './PublishForm.module.css'
import { useOcean, usePublish } from '@oceanprotocol/react'
import { Formik, Form as FormFormik, Field } from 'formik'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import { transformPublishFormToMetadata } from './utils'
import { FormContent, FormFieldProps } from '../../../@types/Form'
import { MetadataPublishForm } from '../../../@types/Metadata'
import { useSiteMetadata } from '../../../hooks/useSiteMetadata'
import { Persist } from 'formik-persist'
import Loader from '../../atoms/Loader'
import { initialValues, validationSchema } from './validation'

export default function PublishForm({
  content
}: {
  content: FormContent
}): ReactElement {
  const { ocean, account } = useOcean()
  const {
    publish,
    publishStepText,
    publishStep,
    isLoading,
    publishError
  } = usePublish()
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
    <Formik
      initialValues={initialValues}
      initialStatus="empty"
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        await handleSubmit(values)
        setSubmitting(false)
      }}
    >
      {({ isValid, status, setStatus }) => (
        <FormFormik
          className={styles.form}
          onChange={() => status === 'empty' && setStatus(null)}
        >
          {content.data.map((field: FormFieldProps) => (
            <Field key={field.name} {...field} component={Input} />
          ))}

          {isLoading ? (
            <Loader message={publishStepText} />
          ) : (
            <Button
              style="primary"
              type="submit"
              disabled={!ocean || !account || !isValid || status === 'empty'}
            >
              Submit
            </Button>
          )}
          <Persist name="ocean-publish-form" />
        </FormFormik>
      )}
    </Formik>
  )
}
