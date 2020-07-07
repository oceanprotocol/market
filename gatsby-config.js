require('dotenv').config()

const siteConfig = require('./content/site.json')

module.exports = {
  siteMetadata: {
    ...siteConfig.site
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
    'gatsby-source-ocean',
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
      // https://www.gatsbyjs.org/packages/gatsby-plugin-manifest/#using-with-gatsby-plugin-offline
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: siteConfig.site.siteTitle,
        short_name: siteConfig.site.siteTitle,
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#141414',
        icon: siteConfig.site.siteIcon,
        display: 'standalone',
        cache_busting_mode: 'none'
      }
    },
    'gatsby-plugin-webpack-size'
  ]
}
