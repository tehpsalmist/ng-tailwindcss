const chokidar = require('chokidar')
const build = require('./build')
const fs = require('fs')
const path = require('path')

module.exports = ({ configPath }) => {
  const ngTwFile = configPath
    ? path.normalize(path.resolve(process.cwd(), configPath))
    : path.normalize(path.resolve(process.cwd(), 'ng-tailwind.js'))

  if (fs.existsSync(ngTwFile)) {
    const config = require(ngTwFile)

    const tailwind = chokidar.watch([config.configJS, config.sourceCSS])

    tailwind.on('change', (event, path) => {
      console.log('Reprocessing changes to Tailwind files')

      build({ configPath })
    })

    const hotReload = chokidar.watch([ngTwFile])

    hotReload.on('change', (event, path) => {
      delete require.cache[ngTwFile]

      console.log('Processing changes to ng-tailwind.js')

      build({})
    })

    printWatchedFiles(config.configJS, config.sourceCSS, ngTwFile)
  } else {
    console.error(`No ng-tailwind.js file found at ${ngTwFile}.
Please run \`ng-tailwindcss configure\` in your project's root directory.
Run \`ng-tailwindcss --help\` for assistance,
or view the Readme at https://github.com/tehpsalmist/ng-tailwindcss`)
  }
}

function printWatchedFiles (...files) {
  console.log(`Watching tailwind files for changes:
  ${files.map(f => path.basename(f)).join('\n  ')}`)
}
