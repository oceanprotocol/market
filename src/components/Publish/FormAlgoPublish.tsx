// import React, {
//   ReactElement,
//   useEffect,
//   useState,
//   FormEvent,
//   ChangeEvent
// } from 'react'
// import { useStaticQuery, graphql } from 'gatsby'
// import { useFormikContext, Field, Form, FormikContextType } from 'formik'
// import Input from '../../atoms/Input'
// import { FormContent, FormFieldProps } from '@types/Form'
// import { MetadataPublishFormAlgorithm } from '@types/MetaData'
// import { initialValues as initialValuesAlgorithm } from '@types/FormAlgoPublish'
// import AdvancedSettings from '../../molecules/FormFields/AdvancedSettings'
// import FormTitle from './FormTitle'
// import FormActions from './FormActions'
// import styles from './FormPublish.module.css'

// const query = graphql`
//   query {
//     content: allFile(
//       filter: { relativePath: { eq: "pages/publish/form-algorithm.json" } }
//     ) {
//       edges {
//         node {
//           childPublishJson {
//             title
//             data {
//               name
//               placeholder
//               label
//               help
//               type
//               required
//               sortOptions
//               options
//               disclaimer
//               disclaimerValues
//               advanced
//             }
//             warning
//           }
//         }
//       }
//     }
//   }
// `

// export default function FormPublish(): ReactElement {
//   const data = useStaticQuery(query)
//   const content: FormContent = data.content.edges[0].node.childPublishJson

//   const {
//     status,
//     setStatus,
//     isValid,
//     setErrors,
//     setTouched,
//     resetForm,
//     initialValues,
//     validateField,
//     setFieldValue
//   }: FormikContextType<MetadataPublishFormAlgorithm> = useFormikContext()
//   const [selectedDockerImage, setSelectedDockerImage] = useState<string>(
//     initialValues.dockerImage
//   )

//   const dockerImageOptions = [
//     {
//       name: 'node:latest',
//       title: 'node:latest',
//       checked: true
//     },
//     {
//       name: 'python:latest',
//       title: 'python:latest',
//       checked: false
//     },
//     {
//       name: 'custom image',
//       title: 'custom image',
//       checked: false
//     }
//   ]

//   // reset form validation on every mount
//   useEffect(() => {
//     setErrors({})
//     setTouched({})
//   }, [setErrors, setTouched])

//   function handleImageSelectChange(imageSelected: string) {
//     switch (imageSelected) {
//       case 'node:latest': {
//         setFieldValue('image', 'node')
//         setFieldValue('containerTag', 'latest')
//         setFieldValue('entrypoint', 'node $ALGO')
//         break
//       }
//       case 'python:latest': {
//         setFieldValue('image', 'oceanprotocol/algo_dockers')
//         setFieldValue('containerTag', 'python-panda')
//         setFieldValue('entrypoint', 'python $ALGO')
//         break
//       }
//       default: {
//         setFieldValue('image', '')
//         setFieldValue('containerTag', '')
//         setFieldValue('entrypoint', '')
//         break
//       }
//     }
//   }

//   // Manually handle change events instead of using `handleChange` from Formik.
//   // Workaround for default `validateOnChange` not kicking in
//   function handleFieldChange(
//     e: ChangeEvent<HTMLInputElement>,
//     field: FormFieldProps
//   ) {
//     const value =
//       field.type === 'checkbox' || field.type === 'terms'
//         ? !JSON.parse(e.target.value)
//         : e.target.value
//     if (field.name === 'dockerImage') {
//       setSelectedDockerImage(e.target.value)
//       handleImageSelectChange(e.target.value)
//     }
//     validateField(field.name)
//     setFieldValue(field.name, value)
//   }

//   const resetFormAndClearStorage = (e: FormEvent<Element>) => {
//     e.preventDefault()
//     resetForm({
//       values: initialValuesAlgorithm as MetadataPublishFormAlgorithm,
//       status: 'empty'
//     })
//     setStatus('empty')
//   }

//   return (
//     <Form
//       className={styles.form}
//       // do we need this?
//       onChange={() => status === 'empty' && setStatus(null)}
//     >
//       <FormTitle title={content.title} />

//       {content.data.map(
//         (field: FormFieldProps) =>
//           field.advanced !== true &&
//           ((field.name !== 'entrypoint' &&
//             field.name !== 'image' &&
//             field.name !== 'containerTag') ||
//             selectedDockerImage === 'custom image') && (
//             <Field
//               key={field.name}
//               {...field}
//               options={
//                 field.type === 'boxSelection'
//                   ? dockerImageOptions
//                   : field.options
//               }
//               component={Input}
//               onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                 handleFieldChange(e, field)
//               }
//             />
//           )
//       )}
//       <AdvancedSettings
//         content={content}
//         handleFieldChange={handleFieldChange}
//       />
//       <FormActions
//         isValid={isValid}
//         resetFormAndClearStorage={resetFormAndClearStorage}
//       />
//     </Form>
//   )
// }
