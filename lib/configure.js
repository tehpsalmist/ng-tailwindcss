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
    whitelist: currentConfig ? currentConfig.whitelist : [],
    whitelistPatterns: currentConfig ? currentConfig.whitelistPatterns : [],
    whitelistPatternsChildren: currentConfig ? currentConfig.whitelistPatternsChildren : [],
    keyframes: currentConfig ? currentConfig.keyframes : false,
    fontFace: currentConfig ? currentConfig.fontFace : false,
    rejected: currentConfig ? currentConfig.rejected : false
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
  configJS: '${config.configJS}',
  sourceCSS: '${config.sourceCSS}',
  outputCSS: '${config.outputCSS}',
  purge: ${config.purge},
  whitelist: ${config.whitelist},
  whitelistPatterns: ${config.whitelistPatterns},
  whitelistPatternsChildren: ${config.whitelistPatternsChildren},
  keyframes: ${config.keyframes},
  fontFace: ${config.fontFace},
  rejected: ${config.rejected}
}
`,
      err => err
        ? console.error('Error creating ng-tailwind.js:', err)
        : console.log('ng-tailwind.js updated!')
    )
  }
}
