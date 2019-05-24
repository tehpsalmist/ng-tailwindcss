const fs = require('fs')
const path = require('path')

module.exports = (userDefConfig, defaultOverride) => {
  const ngTwFile = path.normalize(path.resolve(process.cwd(), 'ng-tailwind.js'))

  let currentConfig = null
  if (fs.existsSync(ngTwFile)) currentConfig = require(ngTwFile)

  const defaultConfig = {
    configJS: `${path.normalize('./tailwind.config.js')}`,
    sourceCSS: `${path.normalize('./src/tailwind.css')}`,
    outputCSS: `${path.normalize('./src/styles.css')}`,
    purge: false,
    sass: false,
    keyframes: (currentConfig && currentConfig.keyframes) || false,
    fontFace: (currentConfig && currentConfig.fontFace) || false,
    rejected: (currentConfig && currentConfig.rejected) || false,
    whitelist: (currentConfig && currentConfig.whitelist) || [],
    whitelistPatterns: (currentConfig && currentConfig.whitelistPatterns) || [],
    whitelistPatternsChildren: (currentConfig && currentConfig.whitelistPatternsChildren) || [],
    extensions: (currentConfig && currentConfig.extensions) || ['.ts', '.html', '.js'],
    extractors: (currentConfig && currentConfig.extractors) || [],
    content: (currentConfig && currentConfig.content) || []
  }

  if (currentConfig && currentConfig.sass) userDefConfig.sass = currentConfig.sass

  const newConfig = defaultOverride
    ? { ...defaultConfig, ...userDefConfig }
    : currentConfig
      ? { ...defaultConfig, ...currentConfig, ...userDefConfig }
      : { ...defaultConfig, ...userDefConfig }

  writeConfigFile(newConfig, ngTwFile)
}

function writeConfigFile (config, file) {
  fs.writeFile(
    file,
    `module.exports = {
  // Tailwind Paths
  configJS: '${config.configJS}',
  sourceCSS: '${config.sourceCSS}',
  outputCSS: '${config.outputCSS}',
  // Sass
  sass: ${config.sass},
  // PurgeCSS Settings
  purge: ${config.purge},
  keyframes: ${config.keyframes},
  fontFace: ${config.fontFace},
  rejected: ${config.rejected},
  whitelist: [${prettyPrint(config.whitelist)}],
  whitelistPatterns: [${prettyPrintRegex(config.whitelistPatterns)}],
  whitelistPatternsChildren: [${prettyPrintRegex(config.whitelistPatternsChildren)}],
  extensions: [${prettyPrint(config.extensions)}],
  extractors: [${prettyPrint(config.extractors)}],
  content: [${prettyPrint(config.content)}]
}\n`,
    err => err
      ? console.error('Error writing to ng-tailwind.js:', err)
      : console.log(`${file} updated!`)
  )
}

function prettyPrint (list) {
  return list.length ? list.reduce((prettiness, item) => `${prettiness}\n    '${item}',`, '').slice(0, -1) + '\n  ' : ''
}

function prettyPrintRegex (list) {
  return list.length ? list.reduce((prettiness, item) => `${prettiness}\n    ${item},`, '').slice(0, -1) + '\n  ' : ''
}
