import React, { ReactElement } from 'react'
import * as Yup from 'yup'
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
import { File as FileMetadata } from '@oceanprotocol/lib/dist/node/ddo/interfaces/File'
import { useSiteMetadata } from '../../../hooks/useSiteMetadata'
import { Persist } from 'formik-persist'
import Loader from '../../atoms/Loader'
import Alert from '../../atoms/Alert'

const validationSchema = Yup.object().shape<MetadataPublishForm>({
  // ---- required fields ----
  name: Yup.string().required('Required'),
  author: Yup.string().required('Required'),
  cost: Yup.string().required('Required'),
  files: Yup.array<FileMetadata>().required('Required').nullable(),
  description: Yup.string().required('Required'),
  license: Yup.string().required('Required'),
  access: Yup.string()
    .matches(/Compute|Download/g)
    .required('Required'),
  termsAndConditions: Yup.boolean().required('Required'),

  // ---- optional fields ----
  copyrightHolder: Yup.string(),
  tags: Yup.string(),
  links: Yup.object<FileMetadata[]>()
})

const initialValues: MetadataPublishForm = {
  name: undefined,
  author: undefined,
  cost: undefined,
  files: undefined,
  description: undefined,
  license: undefined,
  access: undefined,
  termsAndConditions: undefined,
  copyrightHolder: undefined,
  tags: undefined,
  links: undefined
}

export default function PublishForm({
  content
}: {
  content: FormContent
}): ReactElement {
  const { ocean, account } = useOcean()
  const { publish, publishStepText, isLoading, publishError } = usePublish()
  const navigate = useNavigate()
  const { marketAddress } = useSiteMetadata()

  async function handleSubmit(values: MetadataPublishForm) {
    const submittingToast = toast.info('submitting asset')

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

      // User feedback and redirect to new asset detail page
      toast.success('asset created successfully')
      toast.dismiss(submittingToast)

      // TODO: reset form state and make sure persistant form in localStorage is cleared

      navigate(`/asset/${ddo.id}`)
    } catch (error) {
      console.error(error.message)
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
          ) : publishError ? (
            <Alert text={publishError} state="error" />
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
