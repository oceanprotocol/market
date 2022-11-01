/* eslint-disable prettier/prettier */
import React, { ReactElement, useEffect } from 'react'
import FormHelp from '@shared/FormInput/Help'
import Price from './Price'
import Fees from './Fees'
import styles from './Fixed.module.css'
import { FullFeaturedCrudGrid } from './SubsPrice'
import contents from '../../../../content/price.json'
import { useFormikContext } from 'formik'
import { FormPublishData } from '../_types'

export default function Timed({
  approvedBaseTokens,
  content
}: {
  approvedBaseTokens: TokenInfo[]
  content: any
}): ReactElement {
  const { values, setFieldValue } = useFormikContext<FormPublishData>()

  useEffect(() => {
    if (values.pricing.type === 'timed') {
      setFieldValue('pricing.price', 1)
      // setFieldValue('pricing.amountDataToken', 1000)
    }
  }, [setFieldValue, values])

  return (
    <>
      <FormHelp>{content.info}</FormHelp>

      <h4 className={styles.title}>Pricing</h4>

      <Price approvedBaseTokens={approvedBaseTokens} content={contents} />
      <Fees tooltips={content.tooltips} />

      <h4 className={styles.title}>Subscription Prices</h4>
      <FormHelp>{content.subsInfo}</FormHelp>
      {/* <TableApp /> */}
      {/* <StartEditButtonGrid /> */}
      {/* <SuccessApp /> */}
      {/* <SignupForm /> */}
      {/* <FormikArray /> */}
      {/* <_FormikPricing /> */}
      {/* <FormikPricing /> */}
      {/* <Editable /> */}
      {/* <TableDemo /> */}
      {/* <MaterialStory selectableRows={true} expandableRows={true} /> */}
      {/* <TableApp /> */}
      {/* <TableApp2 /> */}
      {/* <SubsPrice approvedBaseTokens={approvedBaseTokens} title={''} tooltip={''} /> */}
      {/* <Example /> */}
      {/* <PricingApp /> */}
      {/* <FormikApp /> */}
      {/* <BasicEditPanelDemo /> */}
      {/* <SpanningTable /> */}
      {/* <CustomEditComponent /> */}
      {/* <BulkEdit /> */}
      {/* <ValueParserSetterGrid /> */}
      <FullFeaturedCrudGrid />
      {/* <SubsPriceUnit /> */}
      {/* < AntDesignGrid /> */}
      {/* <StreamPricing /> */}
      {/* <Friends name={undefined} handleAdd={undefined} handleRemove={undefined} /> */}
    </>
  )
}
