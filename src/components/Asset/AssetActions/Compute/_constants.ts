import { FormConsumerParameter } from '@components/Publish/_types'
import * as Yup from 'yup'
import { generateFormConsumerParameters } from '../ConsumerParameters'

export const ConsumerParametersConsumeSchema = Yup.array()
  .of(
    Yup.object().shape({
      required: Yup.boolean().required('required'),
      value: Yup.mixed().when('required', {
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
  dataServiceParams: any
  algoServiceParams: any
  algoParams: any
}> = Yup.object().shape({
  algorithm: Yup.string().required('Required'),
  dataServiceParams: ConsumerParametersConsumeSchema,
  algoServiceParams: ConsumerParametersConsumeSchema,
  algoParams: ConsumerParametersConsumeSchema
})

export function getInitialValues(
  asset?: AssetExtended,
  selectedAlgorithmAsset?: AssetExtended
): {
  algorithm: string
  dataServiceParams?: FormConsumerParameter[]
  algoServiceParams?: FormConsumerParameter[]
  algoParams?: FormConsumerParameter[]
} {
  return {
    algorithm: selectedAlgorithmAsset?.id,
    dataServiceParams: generateFormConsumerParameters(
      asset?.services[0].consumerParameters
    ),
    algoServiceParams: generateFormConsumerParameters(
      selectedAlgorithmAsset?.services[0].consumerParameters
    ),
    algoParams: generateFormConsumerParameters(
      selectedAlgorithmAsset?.metadata?.algorithm.consumerParameters
    )
  }
}
