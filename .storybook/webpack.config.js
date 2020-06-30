// https://www.gatsbyjs.org/docs/visual-testing-with-storybook/

// Make CSS modules work
// https://github.com/storybookjs/storybook/issues/4306#issuecomment-517951264
const setCssModulesRule = (rule) => {
  const nextRule = rule
  const cssLoader = rule.use[1]

  const nextOptions = {
    ...cssLoader.options,
    modules: {
      localIdentName: '[name]__[local]___[hash:base64:5]'
    }
  }

  cssLoader.options = nextOptions
  return nextRule
}

module.exports = ({ config }) => {
  const cssRules = config.module.rules.map((rule) => {
    const isCssRule = rule.test.toString().indexOf('css') !== -1
    let nextRule = rule

    if (isCssRule) {
      nextRule = setCssModulesRule(rule)
    }
    return nextRule
  })

  config.module.rules = cssRules

  // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
  config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/]
  // use installed babel-loader which is v8.0-beta (which is meant to work with @babel/core@7)
  config.module.rules[0].use[0].loader = require.resolve('babel-loader')

  // use @babel/preset-react for JSX and env (instead of staged presets)
  config.module.rules[0].use[0].options.presets = [
    require.resolve('@babel/preset-react'),
    require.resolve('@babel/preset-env')
  ]
  config.module.rules[0].use[0].options.plugins = [
    // use @babel/plugin-proposal-class-properties for class arrow functions
    require.resolve('@babel/plugin-proposal-class-properties'),
    // use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
    require.resolve('babel-plugin-remove-graphql-queries')
  ]
  // Prefer Gatsby ES6 entrypoint (module) over commonjs (main) entrypoint
  config.resolve.mainFields = ['browser', 'module', 'main']

  // Handle TypeScript
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('babel-loader'),
    options: {
      presets: [['react-app', { flow: false, typescript: true }]],
      plugins: [
        require.resolve('@babel/plugin-proposal-class-properties'),
        // use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
        require.resolve('babel-plugin-remove-graphql-queries')
      ]
    }
  })

  config.resolve.extensions.push('.ts', '.tsx')

  // Handle SVGs
  // Don't use Storybook's default SVG Configuration
  config.module.rules = config.module.rules.map((rule) => {
    if (rule.test.toString().includes('svg')) {
      const test = rule.test.toString().replace('svg|', '').replace(/\//g, '')
      return { ...rule, test: new RegExp(test) }
    } else {
      return rule
    }
  })

  // Use SVG Configuration for SVGR yourself
  config.module.rules.push({
    test: /\.svg$/,
    use: [
      {
        loader: '@svgr/webpack',
        options: {
          svgoConfig: {
            plugins: {
              removeViewBox: false
            }
          }
        }
      },
      'url-loader'
    ]
  })

  return config
}
