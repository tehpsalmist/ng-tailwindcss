const Purgecss = require('purgecss')
const fs = require('fs')
const path = require('path')

module.exports = ({ keyframes, fontFace, rejected, configPath }) => {
  const ngTwFile = configPath
    ? path.normalize(path.resolve(process.cwd(), configPath))
    : path.normalize(path.resolve(process.cwd(), 'ng-tailwind.js'))

  if (fs.existsSync(ngTwFile)) {
    const config = require(ngTwFile)

    if (!Array.isArray(config.extensions)) config.extensions = ['.html', '.ts', '.js']

    const purgecss = new Purgecss({
      content: [
        ...config.content || [],
        ...config.extensions.map(ext => path.normalize(path.resolve(process.cwd(), `./src/**/*${ext}`)))
      ],
      css: [path.normalize(path.resolve(process.cwd(), config.outputCSS))],
      extractors: [
        ...config.extractors || [],
        {
          extractor: class {
            static extract (content) {
              return content.match(/[A-Za-z0-9-_://]+/g) || []
            }
          },
          extensions: config.extensions
        }
      ],
      whitelist: config.whitelist || [],
      whitelistPatterns: config.whitelistPatterns || [],
      whitelistPatternsChildren: config.whitelistPatternsChildren || [],
      keyframes: keyframes || config.keyframes || false,
      fontFace: fontFace || config.fontFace || false,
      rejected: rejected || config.rejected || false
    })

    const purgecssResult = purgecss.purge()[0]

    const newCSS = purgecssResult.css
      .replace(/\/\*[\s\S]+?\*\//g, '')
      .replace(/(\n)\1+/g, '\n\n')
      .trim()

    if (rejected || config.rejected) {
      fs.writeFile(
        path.resolve(process.cwd(), 'rejectedCSS.json'),
        JSON.stringify(purgecssResult.rejected, null, 2),
        err => err ? console.log(err) : console.log(`View rejected selectors at ${path.resolve(process.cwd(), 'rejectedCSS.json')}`)
      )
    }

    fs.writeFile(
      path.resolve(process.cwd(), config.outputCSS),
      newCSS,
      err => err ? console.error(err) : console.info('CSS Purged')
    )
  } else {
    console.error(`No ng-tailwind.js file found at ${ngTwFile}.
Please run \`ngtw configure\` in your project's root directory.
Run \`ngtw --help\` for assistance,
or view the Readme at https://github.com/tehpsalmist/ng-tailwindcss`)
  }
}
