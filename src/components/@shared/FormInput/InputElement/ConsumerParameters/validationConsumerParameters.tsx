import { ConsumerParameter } from '@components/Publish/_types'
import * as Yup from 'yup'
import { SchemaLike } from 'yup/lib/types'
import { paramTypes } from '.'

export const validationConsumerParameters: {
  [key in keyof ConsumerParameter]: SchemaLike
} = {
  name: Yup.string()
    .test('unique', 'Parameter names must be unique', (name, context) => {
      // TODO: revert any
      // from is not yet correctly typed: https://github.com/jquense/yup/issues/398#issuecomment-916693907
      const [parentFormObj, nextParentFormObj] = (context as any).from
      if (
        !nextParentFormObj?.value?.consumerParameters ||
        nextParentFormObj.value.consumerParameters.length === 1
      )
        return true

      const { consumerParameters } = nextParentFormObj.value
      const occasions = consumerParameters.filter(
        (params) => params.name === name
      )
      return occasions.length === 1
    })
    .required('Required'),
  type: Yup.string().oneOf(paramTypes).required('Required'),
  description: Yup.string().required('Required'),
  label: Yup.string().required('Required'),
  required: Yup.mixed()
    .oneOf(['optional', 'required', true, false])
    .required('Required'),
  default: Yup.mixed().required('Required'),
  options: Yup.array().when('type', {
    is: 'select',
    then: Yup.array()
      .of(Yup.object())
      .min(2, 'At least two options are required')
      .required('Required'),
    otherwise: Yup.array()
  })
}
