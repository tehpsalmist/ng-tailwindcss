const exec = require('child_process').exec
const fs = require('fs')
const path = require('path')
const purge = require('./purge')

module.exports = ({ purgeFlag }) => {
  const ngTwFile = path.resolve(process.cwd(), 'ng-tailwind.js')
  if (fs.existsSync(ngTwFile)) {
    const config = require(ngTwFile)
    exec(
      `${path.resolve('./node_modules/.bin/tailwind')} build ${config.sourceCSS} -c ${config.configJS} -o ${config.outputCSS}`,
      err => {
        if (err) return console.error(err)
        console.info('Successful Tailwind Build!')
        if (config.purge || purgeFlag) purge()
      }
    )
  } else {
    console.error(`No ng-tailwind.js file found at ${ngTwFile}.
Please run \`ngtw configure\` in your project's root directory.
Run \`ngtw --help\` for assistance,
or view the Readme at https://github.com/tehpsalmist/ng-tailwindcss`)
  }
}
