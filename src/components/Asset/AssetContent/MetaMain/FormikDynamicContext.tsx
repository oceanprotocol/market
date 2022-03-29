import React, { FC } from 'react'
import { useFormikContext } from 'formik'
import { FormPublishData } from '../../../Publish/_types'

const withFormikDynamicContext = (Component: FC) => {
  return (props: any) => {
    if (!props?.asset?.nft?.tokenURI) {
      const formikContext = useFormikContext<FormPublishData>()
      if (formikContext) {
        return <Component formikContext={formikContext} {...props} />
      }
    }

    return <Component {...props} />
  }
}

export default withFormikDynamicContext
