// Make CSS modules work
// https://github.com/storybookjs/storybook/issues/4306#issuecomment-517951264
const setCssModulesRule = rule => {
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

module.exports = async ({ config, mode }) => {
  const cssRules = config.module.rules.map(rule => {
    const isCssRule = rule.test.toString().indexOf('css') !== -1
    let nextRule = rule

    if (isCssRule) {
      nextRule = setCssModulesRule(rule)
    }
    return nextRule
  })

  config.module.rules = cssRules

  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('babel-loader'),
    options: {
      presets: [['react-app', { flow: false, typescript: true }]]
    }
  })

  config.resolve.extensions.push('.ts', '.tsx')

  config.node = {
    fs: 'empty'
  }

  // Handle SVGs
  // Don't use Storybook's default SVG Configuration
  config.module.rules = config.module.rules.map(rule => {
    if (rule.test.toString().includes('svg')) {
      const test = rule.test
        .toString()
        .replace('svg|', '')
        .replace(/\//g, '')
      return { ...rule, test: new RegExp(test) }
    } else {
      return rule
    }
  })

  // Use SVG Configuration for SVGR yourself
  config.module.rules.push({
    test: /\.svg$/,
    use: ['@svgr/webpack']
  })

  return config
}
