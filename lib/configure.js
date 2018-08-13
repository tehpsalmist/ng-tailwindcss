const fs = require('fs')
const path = require('path')

module.exports = (userDefConfig, defaultOverride) => {
  const ngTwFile = path.resolve(process.cwd(), 'ng-tailwind.js')

  let currentConfig = null
  if (fs.existsSync(ngTwFile)) currentConfig = require(ngTwFile)

  const defaultConfig = {
    configJS: `${path.resolve('./tailwind.js')}`,
    sourceCSS: `${path.resolve('./src/tailwind.css')}`,
    outputCSS: `${path.resolve('./src/styles.css')}`,
    purge: false,
    keyframes: currentConfig ? currentConfig.keyframes || false : false,
    fontFace: currentConfig ? currentConfig.fontFace || false : false,
    rejected: currentConfig ? currentConfig.rejected || false : false,
    whitelist: currentConfig ? currentConfig.whitelist || [] : [],
    whitelistPatterns: currentConfig ? currentConfig.whitelistPatterns || [] : [],
    whitelistPatternsChildren: currentConfig ? currentConfig.whitelistPatternsChildren || [] : []
  }

  let newConfig

  if (defaultOverride) {
    newConfig = {
      ...defaultConfig,
      ...userDefConfig
    }
    writeConfigFile(newConfig)
  } else if (currentConfig) {
    newConfig = {
      ...defaultConfig,
      ...currentConfig,
      ...userDefConfig
    }
    writeConfigFile(newConfig)
  } else {
    newConfig = {
      ...defaultConfig,
      ...userDefConfig
    }
    writeConfigFile(newConfig)
  }

  function writeConfigFile (config) {
    fs.writeFile(
      ngTwFile,
      `module.exports = {
  // Tailwind Paths
  configJS: '${config.configJS}',
  sourceCSS: '${config.sourceCSS}',
  outputCSS: '${config.outputCSS}',
  // PurgeCSS Settings
  purge: ${config.purge},
  keyframes: ${config.keyframes},
  fontFace: ${config.fontFace},
  rejected: ${config.rejected},
  whitelist: [${prettyPrint(config.whitelist)}],
  whitelistPatterns: [${prettyPrintRegex(config.whitelistPatterns)}],
  whitelistPatternsChildren: [${prettyPrintRegex(config.whitelistPatternsChildren)}]
}\n`,
      err => err
        ? console.error('Error writing to ng-tailwind.js:', err)
        : console.log('ng-tailwind.js updated!')
    )
  }

  function prettyPrint (list) {
    return list.length ? list.reduce((prettiness, item) => `${prettiness}\n    '${item}',`, '').slice(0, -1) + '\n  ' : ''
  }

  function prettyPrintRegex (list) {
    return list.length ? list.reduce((prettiness, item) => `${prettiness}\n    ${item},`, '').slice(0, -1) + '\n  ' : ''
  }
}
