const chokidar = require('chokidar')
const build = require('./build')
const fs = require('fs')
const path = require('path')

function getFilesList (folder) {
  return fs.readdirSync(folder)
    .map(file => {
      const pathToFile = path.join(folder, file)
      return fs.statSync(pathToFile).isDirectory()
        ? getFilesList(pathToFile)
        : pathToFile
    })
}

module.exports = ({ configPath }) => {
  const ngTwFile = configPath
    ? path.normalize(path.resolve(process.cwd(), configPath))
    : path.normalize(path.resolve(process.cwd(), 'ng-tailwind.js'))

  if (fs.existsSync(ngTwFile)) {
    const config = require(ngTwFile)
    config.bundles.forEach(bundle => {
      let { configJS, sourceCSS, watchRelatedFiles = [], watchRelatedFolders = [] } = bundle

      const relatedFilesByFolders = watchRelatedFolders.map(folder => getFilesList(folder)).flat(Infinity) || []

      watchRelatedFiles = [...watchRelatedFiles, ...relatedFilesByFolders]

      const tailwind = chokidar.watch([configJS, sourceCSS, ...watchRelatedFiles])

      tailwind.on('change', (event, path) => {
        console.log('Reprocessing changes to Tailwind files')

        build({ configPath })
      })

      printWatchedFiles(configJS, sourceCSS, ngTwFile, ...watchRelatedFiles)
    })

    const hotReload = chokidar.watch([ngTwFile])

    hotReload.on('change', (event, path) => {
      console.log('Processing changes to ng-tailwind.js')
      console.log('if you have changed some paths - please restart this job')
      build({ configPath })
    })

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
