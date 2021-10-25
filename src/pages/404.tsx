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
          body {
            background: url(${fishfail}) center bottom no-repeat;
            background-size: cover;
            min-height: 100vh;
          }

          main {
            text-align: center;
          }

          header *,
          footer *,
          main * {
            color: var(--brand-white) !important;
          }

          header svg path {
            fill: var(--brand-white) !important;
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
