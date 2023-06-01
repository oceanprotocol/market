import { ConsumerParameter, UserCustomParameters } from '@oceanprotocol/lib'
import * as Yup from 'yup'
import { getDefaultValues } from '../ConsumerParameters/FormConsumerParameters'
import { getUserCustomParameterValidationSchema } from '../ConsumerParameters/_validation'

export function getComputeValidationSchema(
  dataServiceParams: ConsumerParameter[],
  algoServiceParams: ConsumerParameter[],
  algoParams: ConsumerParameter[]
): Yup.SchemaOf<{
  algorithm: string
  dataServiceParams: any
  algoServiceParams: any
  algoParams: any
}> {
  return Yup.object().shape({
    algorithm: Yup.string().required('Required'),
    dataServiceParams:
      getUserCustomParameterValidationSchema(dataServiceParams),
    algoServiceParams:
      getUserCustomParameterValidationSchema(algoServiceParams),
    algoParams: getUserCustomParameterValidationSchema(algoParams)
  })
}

export function getInitialValues(
  asset?: AssetExtended,
  selectedAlgorithmAsset?: AssetExtended
): {
  algorithm: string
  dataServiceParams?: UserCustomParameters
  algoServiceParams?: UserCustomParameters
  algoParams?: UserCustomParameters
} {
  return {
    algorithm: selectedAlgorithmAsset?.id,
    dataServiceParams: getDefaultValues(asset?.services[0].consumerParameters),
    algoServiceParams: getDefaultValues(
      selectedAlgorithmAsset?.services[0].consumerParameters
    ),
    algoParams: getDefaultValues(
      selectedAlgorithmAsset?.metadata?.algorithm.consumerParameters
    )
  }
}
