import React, { ReactElement } from 'react'
import { PageProps, graphql } from 'gatsby'
import Page from '../components/templates/Page'
import fishfail from '../images/fishfail.gif'
import { Helmet } from 'react-helmet'
import Button from '../components/atoms/Button'

export default function PageGatsby404(props: PageProps): ReactElement {
  const {
    title,
    description,
    actions
  } = (props.data as any).content.edges[0].node.childPagesJson

  return (
    <>
      <Helmet>
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
      </Helmet>
      <Page
        title={title}
        description={description}
        uri={props.uri}
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

export const contentQuery = graphql`
  query Page404Query {
    content: allFile(filter: { relativePath: { eq: "pages/404.json" } }) {
      edges {
        node {
          childPagesJson {
            title
            description
            actions {
              title
              url
            }
          }
        }
      }
    }
  }
`
