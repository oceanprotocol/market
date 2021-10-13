import * as Yup from 'yup'

export const validationSchema: Yup.SchemaOf<{
  algorithm: string
}> = Yup.object().shape({
  algorithm: Yup.string().required('Required')
})

export function getInitialValues(): { algorithm: string } {
  return {
    algorithm: undefined
  }
}
