const path = require('path')

async function createMarkdownPages(graphql, actions) {
  const { createPage } = actions

  const markdownPageTemplate = path.resolve(
    './src/components/@shared/Page/PageMarkdown.tsx'
  )
  // Grab all markdown files with a frontmatter title defined
  const markdownResult = await graphql(`
    {
      allMarkdownRemark(filter: { frontmatter: { title: { ne: "" } } }) {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `)

  if (markdownResult.errors) {
    throw markdownResult.errors
  }

  // Create markdown pages.
  const markdownPages = markdownResult.data.allMarkdownRemark.edges

  markdownPages.forEach((page) => {
    createPage({
      path: page.node.fields.slug,
      component: markdownPageTemplate,
      context: {
        slug: page.node.fields.slug
      }
    })
  })
}

module.exports = createMarkdownPages
