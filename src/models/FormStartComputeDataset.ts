import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  algorithm: Yup.string().required('Required')
})

export function getInitialValues() {
  return {
    algorithm: ''
  }
}
