import React, { ReactElement } from 'react'
import * as Yup from 'yup'
import { toStringNoMS } from '../../../utils'
import { toast } from 'react-toastify'
import styles from './PublishForm.module.css'
import { useOcean } from '@oceanprotocol/react'
import {
  Service,
  ServiceCompute
} from '@oceanprotocol/squid/dist/node/ddo/Service'
import { Formik, Form as FormFormik, Field } from 'formik'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import { transformPublishFormToMetadata } from './utils'
import { FormContent, FormFieldProps } from '../../../@types/Form'
import { MetaDataPublishForm, AccessType } from '../../../@types/MetaData'
import AssetModel from '../../../models/Asset'

const validationSchema = Yup.object().shape<MetaDataPublishForm>({
  // ---- required fields ----
  name: Yup.string().required('Required'),
  author: Yup.string().required('Required'),
  price: Yup.string().required('Required'),
  files: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  license: Yup.string().required('Required'),
  access: Yup.string().required('Required'),
  termsAndConditions: Yup.boolean().required('Required'),

  // ---- optional fields ----
  copyrightHolder: Yup.string(),
  tags: Yup.string(),
  links: Yup.string()
})

const initialValues: MetaDataPublishForm = {
  name: undefined,
  author: undefined,
  price: undefined,
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

  async function handleSubmit(values: MetaDataPublishForm) {
    const submittingToast = toast.info('submitting asset', {
      className: styles.info
    })

    console.log(values)
    const metadata = transformPublishFormToMetadata(values)
    console.log(metadata)

    // if services array stays empty, the default access service
    // will be created by squid-js
    // let services: Service[] = []

    // if (metadata.additionalInformation.access === 'Compute') {
    //   const computeService: ServiceCompute = await ocean.compute.createComputeServiceAttributes(
    //     account,
    //     metadata.main.price,
    //     // Note: a hack without consequences.
    //     // Will make metadata.main.datePublished (automatically created by Aquarius)
    //     // go out of sync with this service.main.datePublished.
    //     toStringNoMS(new Date(Date.now()))
    //   )
    //   services = [computeService]
    // }

    // try {
    //   const asset = await ocean.assets.create(
    //     (metadata as unknown) as MetaData,
    //     account,
    //     services
    //   )

    //   // TODO: Reset the form to initial values

    //   // User feedback and redirect
    //   toast.success('asset created successfully', {
    //     className: styles.success
    //   })
    //   toast.dismiss(submittingToast)
    //   // navigate(`/asset/${asset.id}`)
    // } catch (e) {
    //   console.error(e.message)
    // }
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
      {({ isSubmitting, isValid, status, setStatus }) => (
        <FormFormik
          className={styles.form}
          onChange={() => status === 'empty' && setStatus(null)}
        >
          {content.data.map((field: FormFieldProps) => (
            <Field key={field.name} {...field} component={Input} />
          ))}

          <Button
            style="primary"
            type="submit"
            disabled={
              !ocean ||
              !account ||
              isSubmitting ||
              //! isValid ||
              status === 'empty'
            }
          >
            Submit
          </Button>
        </FormFormik>
      )}
    </Formik>
  )
}
