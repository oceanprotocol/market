import React, { ReactElement, useEffect } from 'react'
import { graphql, PageProps, navigate, Link } from 'gatsby'
import Page from './Page'
import styles from './PagePolicy.module.css'
import Container from '../atoms/Container'
import { useUserPreferences } from '../../providers/UserPreferences'
import PrivacyPolicy, { PrivacyPolicyParams } from '../molecules/PrivacyPolicy'

interface PolicyLanguageOption {
  node: {
    frontmatter: {
      language: string
    }
    fields: {
      slug: string
    }
  }
}

interface PolicyPageFrontmatter {
  title: string
  description: string
  date: string
  language: string
  params: PrivacyPolicyParams
}

export default function PageTemplatePolicy(props: PageProps): ReactElement {
  const { privacyPolicySlug, setPrivacyPolicySlug } = useUserPreferences()

  const languageOptions = (props.data as any).allMarkdownRemark
    .edges as Array<PolicyLanguageOption>

  const { html, tableOfContents, frontmatter } = (props.data as any)
    .markdownRemark
  const { title, description, params } = frontmatter as PolicyPageFrontmatter

  const privacyPolicy = { html, tableOfContents, ...frontmatter }

  useEffect(() => {
    if (props.uri !== privacyPolicySlug)
      navigate(`${privacyPolicySlug}${window.location.hash}`)
  }, [])

  return (
    <Page title={title} description={description} uri={props.uri} headerCenter>
      <Container narrow>
        <div className={styles.langSelect}>
          <span className={styles.langLabel}>
            {params?.languageLabel || 'Language'}
          </span>
          <div className={styles.langOptions}>
            {languageOptions.map((langNode, i) => {
              const { slug } = langNode.node.fields
              return (
                <>
                  {i > 0 && ' - '}
                  <Link
                    to={slug}
                    key={slug}
                    onClick={() => {
                      setPrivacyPolicySlug(slug)
                    }}
                  >
                    {langNode.node.frontmatter.language}
                  </Link>
                </>
              )
            })}
          </div>
        </div>
        <PrivacyPolicy {...privacyPolicy} />
      </Container>
    </Page>
  )
}

export const pageQuery = graphql`
  query PolicyPageQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      tableOfContents(absolute: false)
      frontmatter {
        title
        description
        language
        date
        params {
          languageLabel
          tocHeader
          updated
          dateFormat
        }
      }
    }
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "//content/pages/privacypolicy//" } }
    ) {
      edges {
        node {
          frontmatter {
            language
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
