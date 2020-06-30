const exec = require('child_process').exec
const fs = require('fs')
const path = require('path')
const purge = require('./purge')

// Conditionally require node-sass or dart-sass
const pathToNodeSass = path.normalize(path.resolve(process.cwd(), 'node_modules', 'node-sass'))
const pathToDartSass = path.normalize(path.resolve(process.cwd(), 'node_modules', 'sass'))

function defineSass (sassType) {
  if (sassType === true) {
    try {
      return require(pathToNodeSass)
    } catch {
      try {
        return require(pathToDartSass)
      } catch {
        return null
      }
    }
  }

  if (sassType === false) {
    return null
  }

  try {
    if (sassType === 'node-sass') {
      return require(pathToNodeSass)
    }

    if (sassType === 'sass' || sassType === 'dart-sass') {
      return require(pathToDartSass)
    }
  } catch {
    return null
  }

  console.error('Invalid sass option in ng-tailwind.js: sass value must be "sass", "dart-sass", or "node-sass".\nOr pass `true` for default behavior of node-sass -> dart-sass fallback.')
  return null
}

module.exports = ({ purgeFlag, configPath }) => {
  const ngTwFile = configPath
    ? path.normalize(path.resolve(process.cwd(), configPath))
    : path.normalize(path.resolve(process.cwd(), 'ng-tailwind.js'))

  const config = fs.existsSync(ngTwFile) && require(ngTwFile)

  const twBuild = (sourceFile) => new Promise((resolve, reject) => exec(
    `${path.normalize('./node_modules/.bin/tailwind')} build "${sourceFile}" -c "${config.configJS}" -o "${config.outputCSS}"`,
    err => {
      if (err) return reject(err)

      console.info('Successful Tailwind Build!')

      if (config.purge || purgeFlag) purge({ configPath })

      return resolve(sourceFile)
    }
  ))

  const sass = defineSass(config.sass)

  const sassBuild = (configPath) => new Promise((resolve, reject) => sass.render({
    file: config.sourceCSS
  }, (err, result) => {
    if (err) return reject(err)

    const tempFile = configPath
      ? path.normalize(path.resolve(process.cwd(), configPath.replace(/([\w\-.]+[-.][\w\-.]+\.(\w+))/, 'temporary-tailwind-css-file.css'))) // puts temp file in same dir as config file
      : path.normalize(path.resolve(process.cwd(), 'temporary-tailwind-css-file.css'))

    fs.writeFile(tempFile, result.css, err => err ? reject(err) : console.info('Sass Compiled.') || resolve(tempFile))
  }))

  const removeFile = (file) => {
    if (fs.existsSync(file)) {
      fs.unlink(file, err => err && console.error(err))
    }
  }

  if (config) {
    if (config.sass) {
      sass
        ? sassBuild(configPath).then(twBuild).then(removeFile).catch(err => err && console.error(err))
        : console.log('No sass compiler installed. Run `npm i -O node-sass` or `npm i -O sass` and try again.')
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
