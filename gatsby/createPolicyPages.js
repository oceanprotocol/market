const path = require('path')

async function createPolicyPages(graphql, actions) {
  const { createPage } = actions

  const privacyPolicyPageTemplate = path.resolve(
    './src/components/templates/PagePolicy.tsx'
  )

  // Grab all policy files within "content/pages/privacypolicy/"
  const policiesResult = await graphql(
    `
      {
        allMarkdownRemark(
          filter: {
            fileAbsolutePath: { regex: "//content/pages/privacypolicy//" }
          }
        ) {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `
  )

  if (policiesResult.errors) {
    throw policiesResult.errors
  }

  // Create policy pages.
  const privacyPolicies = policiesResult.data.allMarkdownRemark.edges

  privacyPolicies.forEach((page) => {
    createPage({
      path: page.node.fields.slug,
      component: privacyPolicyPageTemplate,
      context: {
        slug: page.node.fields.slug
      }
    })
  })
}

module.exports = createPolicyPages
