const exec = require('child_process').exec
const fs = require('fs')
const path = require('path')
const purge = require('./purge')
const sass = require('node-sass')

module.exports = ({ purgeFlag }) => {
  const ngTwFile = path.normalize(path.resolve(process.cwd(), 'ng-tailwind.js'))
  const config = fs.existsSync(ngTwFile) && require(ngTwFile)

  const twBuild = (sourceFile) => new Promise((resolve, reject) => exec(
    `${path.normalize('./node_modules/.bin/tailwind')} build "${sourceFile}" -c "${config.configJS}" -o "${config.outputCSS}"`,
    err => {
      if (err) return reject(err)

      console.info('Successful Tailwind Build!')

      if (config.purge || purgeFlag) purge({})

      return resolve(sourceFile)
    }
  ))

  const sassBuild = () => new Promise((resolve, reject) => sass.render({
    file: config.sourceCSS
  }, (err, result) => {
    if (err) return reject(err)

    const tempFile = path.normalize(path.resolve(process.cwd(), 'temporary-tailwind-css-file.css'))

    fs.writeFile(tempFile, result.css, err => err ? reject(err) : resolve(tempFile))
  }))

  const removeFile = (file) => fs.unlink(file, err => err && console.error(err))

  if (config) {
    if (config.sass) {
      sassBuild().then(twBuild).then(removeFile).catch(err => err && console.error(err))
    } else {
      twBuild(config.sourceCSS).catch(err => err && console.error(err))
    }
  } else {
    console.error(`No ng-tailwind.js file found at ${ngTwFile}.
Please run \`ngtw configure\` in your project's root directory.
Run \`ngtw --help\` for assistance,
or view the Readme at https://github.com/tehpsalmist/ng-tailwindcss`)
  }
}
