import React, { ReactElement, useEffect, useState } from 'react'
import { PageProps } from 'gatsby'
import PageTemplateAlgorithmDetails from '../../components/templates/PageAlgorithmDetails'
import AlgorithmProvider from '../../providers/Algorithm'

export default function PageGatsbyAssetDetails(props: PageProps): ReactElement {
  const [did, setDid] = useState<string>()

  useEffect(() => {
    console.log('did', props.location.pathname.split('/')[2])
    setDid(props.location.pathname.split('/')[2])
  }, [props.location.pathname])

  return (
    <AlgorithmProvider asset={did}>
      <PageTemplateAlgorithmDetails uri={props.location.pathname} />
    </AlgorithmProvider>
  )
}
