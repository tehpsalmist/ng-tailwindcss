const exec = require('child_process').exec
const fs = require('fs')
const path = require('path')

module.exports = () => {
  const ngTwFile = path.resolve(process.cwd(), 'ng-tailwind.js')
  if (fs.existsSync(ngTwFile)) {
    const config = require(ngTwFile)
    exec(
      `${path.resolve('./node_modules/.bin/tailwind')} build ${config.sourceCSS} -c ${config.configJS} -o ${config.outputCSS}`,
      err => err ? console.error(err) : console.info('Successful Tailwind Build!')
    )
  } else {
    console.error(
      'No ng-tailwind.js file exists.\n' +
      'Please run `ng-tailwindcss configure`.\n\n' +
      'Run `ng-tailwindcss --help` for assistance,\n' +
      'or view the Readme at\n' +
      'https://github.com/tehpsalmist/ng-tailwindcss'
    )
  }
}
