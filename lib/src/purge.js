const Purgecss = require('purgecss')
const fs = require('fs')
const path = require('path')

function purgeCSS ({ keyframes, fontFace, rejected, config, configPath }) {
  const purgecss = new Purgecss({
    content: [
      ...(config.content || []),
      ...config.extensions.map(ext =>
        configPath
          ? path.normalize(
            path.resolve(
              process.cwd(),
              configPath.replace(
                /([\w\-.]+[-.][\w\-.]+\.(\w+))/,
                  `./src/**/*${ext}`
              )
            )
          )
          : path.normalize(path.resolve(process.cwd(), `./src/**/*${ext}`))
      )
    ],
    css: [path.normalize(path.resolve(process.cwd(), config.outputCSS))],
    extractors: [
      {
        extractor: class {
          static extract (content) {
            return content.match(/[A-Za-z0-9-_://]+/g) || []
          }
        },
        extensions: config.extensions
      },
      ...(config.extractors || [])
    ],
    whitelist: config.whitelist || [],
    whitelistPatterns: config.whitelistPatterns || [],
    whitelistPatternsChildren: config.whitelistPatternsChildren || [],
    keyframes: keyframes || config.keyframes || false,
    fontFace: fontFace || config.fontFace || false,
    rejected: rejected || config.rejected || false
  })
  return purgecss.purge()[0]
}

function handleRejected ({ rejected, config, css }) {
  if (rejected || config.rejected) {
    fs.writeFile(
      path.resolve(process.cwd(), 'rejectedCSS.json'),
      JSON.stringify(css.rejected, null, 2),
      err =>
        err
          ? console.log(err)
          : console.log(
              `View rejected selectors at ${path.resolve(
                process.cwd(),
                'rejectedCSS.json'
              )}`
          )
    )
  }
}

function writePurgeCSS ({ config, css }) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.resolve(process.cwd(), config.outputCSS), css, err =>
      err ? reject(err) : resolve('CSS Purged')
    )
  })
}

module.exports = ({ keyframes, fontFace, rejected, configPath }) => {
  return new Promise((resolve, reject) => {
    const ngTwFile = configPath
      ? path.normalize(path.resolve(process.cwd(), configPath))
      : path.normalize(path.resolve(process.cwd(), 'ng-tailwind.js'))

    if (fs.existsSync(ngTwFile)) {
      const config = require(ngTwFile)

      if (!Array.isArray(config.extensions)) {
        config.extensions = ['.html', '.ts', '.js']
      }

      const purgecssResult = purgeCSS({
        keyframes,
        fontFace,
        rejected,
        config,
        configPath
      })

      const newCSS = purgecssResult.css
        .replace(/\/\*[\s\S]+?\*\//g, '')
        .replace(/(\n)\1+/g, '\n\n')
        .trim()

      handleRejected({ rejected, config, css: newCSS })

      writePurgeCSS({ config, css: newCSS })
        .then(response => resolve(response))
        .catch(e => reject(e))
    } else {
      reject(
        new Error(`No ng-tailwind.js file found at ${ngTwFile}.
      Please run \`ngtw configure\` in your project's root directory.
      Run \`ngtw --help\` for assistance,
      or view the Readme at https://github.com/tehpsalmist/ng-tailwindcss`)
      )
    }
  })
}
