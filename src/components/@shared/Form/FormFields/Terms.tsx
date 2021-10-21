import React, { ReactElement } from 'react'
import { InputProps } from '@shared/Form/Input'
import InputElement from '@shared/Form/Input/InputElement'
import styles from './Terms.module.css'
import { graphql, useStaticQuery } from 'gatsby'

const query = graphql`
  query TermsQuery {
    terms: markdownRemark(fields: { slug: { eq: "/terms" } }) {
      html
    }
  }
`

export default function Terms(props: InputProps): ReactElement {
  const data = useStaticQuery(query)
  const termsProps: InputProps = {
    ...props,
    defaultChecked: props?.value?.toString() === 'true'
  }

  return (
    <>
      <div
        className={styles.terms}
        dangerouslySetInnerHTML={{ __html: data.terms.html }}
      />
      <InputElement {...termsProps} type="checkbox" />
    </>
  )
}
