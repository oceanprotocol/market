const dotenv = require('./src/ewai/dotenv-expand')
const siteContent = require('./content/site.json')
const appConfig = require('./app.config')
const ewaiConfig = require('./src/ewai/ewai.config')
import { EwaiClient } from './src/ewai/client/ewai-js'

console.log(process.env.EWAI_API_GRAPHQL_URL)

export default {
  siteMetadata: {
    ...siteContent.site,
    appConfig: {
      ...appConfig
    },
    ewaiConfig: {
      ...ewaiConfig
    }
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/content`
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'art',
        path: `${__dirname}/node_modules/@oceanprotocol/art/`
      }
    },
    {
      resolve: 'gatsby-plugin-sharp',
      options: {
        defaultQuality: 80
      }
    },
    'gatsby-transformer-sharp',
    'gatsby-transformer-json',
    'gatsby-transformer-remark',
    {
      resolve: 'gatsby-plugin-svgr',
      options: {
        icon: false,
        svgoConfig: {
          plugins: [{ removeViewBox: false }]
        }
      }
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-remove-trailing-slashes',
    {
      resolve: 'gatsby-source-graphql',
      options: {
        typeName: 'EWAI',
        fieldName: 'ewai',
        url: process.env.EWAI_API_GRAPHQL_URL,
        // HTTP headers
        //headers: {
        //  Authorization: `Bearer xxxxx`,
        //},
        // HTTP headers alternatively accepts a function (allows async)
        headers: async () => {
          const ewaiClient = new EwaiClient({
            username: process.env.EWAI_API_USERNAME,
            password: process.env.EWAI_API_PASSWORD,
            graphQlUrl: process.env.EWAI_API_GRAPHQL_URL
          })
          const login = await ewaiClient.getEwaiAuthHeaderConfigAsync()
          return login.headers
        },
        // Additional options to pass to node-fetch
        fetchOptions: {}
      }
    },
    {
      // https://www.gatsbyjs.org/packages/gatsby-plugin-manifest/#using-with-gatsby-plugin-offline
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: siteContent.site.siteTitle,
        short_name: siteContent.site.siteTitle,
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#141414',
        icon: siteContent.site.siteIcon,
        display: 'standalone',
        cache_busting_mode: 'none'
      }
    },
    'gatsby-plugin-webpack-size',
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingId: appConfig.analyticsId,
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: false,
        // Setting this parameter is optional
        anonymize: true,
        // Setting this parameter is also optional
        respectDNT: true,
        // Defers execution of google analytics script after page load
        defer: true,
        cookieDomain: 'energyweb.org' // ewai change
      }
    },
    {
      resolve: 'gatsby-plugin-use-dark-mode',
      options: {
        ...appConfig.darkModeConfig,
        minify: true
      }
    }
  ]
}
