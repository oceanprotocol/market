import { ConsumerParameter } from '@components/Publish/_types'
import * as Yup from 'yup'

export const ConsumerParametersConsumeSchema = Yup.array()
  .of(
    Yup.object().shape({
      required: Yup.boolean().required('required'),
      default: Yup.mixed().when('required', {
        is: false,
        then: Yup.mixed()
          .nullable()
          .transform((value) => value || null),
        otherwise: Yup.mixed().required('Required')
      })
    })
  )
  .nullable()

export const validationSchema: Yup.SchemaOf<{
  algorithm: string
  dataService: any
  algoService: any
  algoParams: any
}> = Yup.object().shape({
  algorithm: Yup.string().required('Required'),
  dataService: ConsumerParametersConsumeSchema,
  algoService: ConsumerParametersConsumeSchema,
  algoParams: ConsumerParametersConsumeSchema
})

export function getInitialValues(): {
  algorithm: string
  dataService?: ConsumerParameter[]
  algoService?: ConsumerParameter[]
  algoParams?: ConsumerParameter[]
} {
  return {
    algorithm: undefined,
    dataService: undefined,
    algoService: undefined,
    algoParams: undefined
  }
}
