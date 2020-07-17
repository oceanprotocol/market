const { createFilePath } = require('gatsby-source-filesystem')

function createMarkdownFields(node, actions, getNode) {
  const { createNodeField } = actions

  // Automatically create slugs for specific node types,
  // relative to ./content/
  const { type } = node.internal

  if (type === 'MarkdownRemark') {
    // Create a slug from the file path & name
    const slug = createFilePath({
      node,
      getNode,
      trailingSlash: false
    })

    createNodeField({
      name: 'slug',
      node,
      value: slug
    })
  }
}

module.exports = createMarkdownFields
