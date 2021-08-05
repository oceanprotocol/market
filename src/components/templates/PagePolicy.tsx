import React, { ReactElement, ChangeEvent, useEffect } from 'react'
import { graphql, PageProps, navigate } from 'gatsby'
import Page from './Page'
import Container from '../atoms/Container'
import Input from '../atoms/Input'
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
  const { title, description, language, params } =
    frontmatter as PolicyPageFrontmatter

  const privacyPolicy = { html, tableOfContents, ...frontmatter }

  useEffect(() => {
    // Redirect to user selected language
    if (props.uri !== privacyPolicySlug) {
      navigate(privacyPolicySlug)
    }
  }, [])

  return (
    <Page title={title} description={description} uri={props.uri} headerCenter>
      <Container narrow>
        <Input
          name="policyLanguage"
          label={params?.languageLabel || 'Language'}
          help={params?.languageHelp || 'The language of the privacy policy'}
          type="select"
          options={languageOptions.map((langnode) => {
            return langnode.node.frontmatter.language
          })}
          value={language}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            const slug =
              languageOptions.find(
                (langnode) =>
                  langnode.node.frontmatter.language === e.target.value
              )?.node.fields.slug || props.path
            setPrivacyPolicySlug(slug)
            navigate(slug)
          }}
          size="small"
        />
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
          languageHelp
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
