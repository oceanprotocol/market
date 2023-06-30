import {
  FormConsumerParameter,
  FormPublishData,
  FormPublishService
} from '@components/Publish/_types'
import * as Yup from 'yup'
import { SchemaLike } from 'yup/lib/types'
import { paramTypes } from '.'

interface TestContextExtended extends Yup.TestContext {
  from: {
    value: FormPublishData['metadata'] | FormPublishService
  }[]
}

export const validationConsumerParameters: {
  [key in keyof FormConsumerParameter]: SchemaLike
} = {
  name: Yup.string()
    .test('unique', 'Parameter names must be unique', (name, context) => {
      const [parentFormObj, nextParentFormObj] = (
        context as TestContextExtended
      ).from

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
    .min(4, (param) => `Name must be at least ${param.min} characters`)
    .max(50, (param) => `Name must have maximum ${param.max} characters`)
    .required('Required'),
  type: Yup.string().oneOf(paramTypes).required('Required'),
  description: Yup.string()
    .min(10, (param) => `Description must be at least ${param.min} characters`)
    .max(
      500,
      (param) => `Description must have maximum ${param.max} characters`
    )
    .required('Required'),
  label: Yup.string()
    .min(4, (param) => `Label must be at least ${param.min} characters`)
    .max(50, (param) => `Label must have maximum ${param.max} characters`)
    .required('Required'),
  required: Yup.string().oneOf(['optional', 'required']).required('Required'),
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
