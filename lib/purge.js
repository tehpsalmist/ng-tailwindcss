const Purgecss = require('purgecss')
const fs = require('fs')
const path = require('path')

module.exports = () => {
  const ngTwFile = path.resolve(process.cwd(), 'ng-tailwind.js')
  if (fs.existsSync(ngTwFile)) {
    const config = require(ngTwFile)
    const purgecss = new Purgecss({
      content: [path.resolve(process.cwd(), './src/**/*.html'), path.resolve(process.cwd(), './src/**/*.ts')],
      css: [path.resolve(process.cwd(), config.outputCSS)],
      extractors: [
        {
          extractor: class {
            static extract (content) {
              return content.match(/[A-Za-z0-9-_://]+/g) || []
            }
          },
          extensions: ['html', 'ts']
        }
      ]
    })
    const purgecssResult = purgecss.purge()[0].css
      .replace(/\/\*[\s\S]+?\*\//g, '')
      .replace(/(\n)\1+/g, '\n\n')
      .trim()

    fs.writeFile(
      path.resolve(process.cwd(), config.outputCSS),
      purgecssResult,
      err => err ? console.error(err) : console.info('CSS Purged')
    )
  } else {
    console.error(`No ng-tailwind.js file found at ${ngTwFile}.
Please run \`ngtw configure\` in your project's root directory.
Run \`ngtw --help\` for assistance,
or view the Readme at https://github.com/tehpsalmist/ng-tailwindcss`)
  }
}
