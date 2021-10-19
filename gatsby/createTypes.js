function createTypes(actions) {
  const { createTypes } = actions

  // Extend ContentJson to support optional field "optionalCookies" in gdpr.json
  // Extend PublishJsonData to support optional fields for disclaimers
  const typeDefs = `
    type ContentJson implements Node {
      accept: String
      reject: String
      close: String
      configure: String
      optionalCookies: [Cookie!]
    }
    type Cookie {
      title: String!
      desc: String!
      cookieName: String!
    }
    type PublishJsonData implements Node {
      disclaimer: String
      disclaimerValues: [String!]
    }
  `
  createTypes(typeDefs)
}

module.exports = createTypes
