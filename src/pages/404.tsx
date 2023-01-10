import React, { ReactElement } from 'react'
import Page from '@shared/Page'
import fishfail from '@images/fishfail.gif'
import Head from 'next/head'
import Button from '@shared/atoms/Button'
import content from '../../content/pages/404.json'
import { useRouter } from 'next/router'

export default function Page404(): ReactElement {
  const router = useRouter()
  const { title, description, actions } = content

  return (
    <>
      <Head>
        <style type="text/css">{`
          main {
            text-align: center;
          }
        `}</style>
      </Head>
      <Page
        title={title}
        description={description}
        uri={router.route}
        headerCenter
      >
        {actions.map((action: { title: string; url: string }) => (
          <Button style="primary" key={action.title} to={action.url}>
            {action.title}
          </Button>
        ))}
      </Page>
    </>
  )
}
