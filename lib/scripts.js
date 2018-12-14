const fs = require('fs')
const path = require('path')

module.exports = () => {
  fs.readFile(path.normalize(path.resolve(process.cwd(), 'package.json')), (err, data) => {
    if (err) {
      throw err
    } else {
      const packageJSON = JSON.parse(data)
      if (!packageJSON.scripts) packageJSON.scripts = {}

      if (!packageJSON.scripts.prestart) {
        packageJSON.scripts.prestart = 'ngtw build'
      } else if (!packageJSON.scripts.prestart.match(/ng-tailwindcss|ngtw/)) {
        packageJSON.scripts.prestart = 'ngtw build && ' + packageJSON.scripts.prestart
      } else {
        console.log('Skipping prestart script')
      }

      if (!packageJSON.scripts.start) {
        packageJSON.scripts.start = 'ng serve & ngtw watch'
      } else if (!packageJSON.scripts.start.match(/ng-tailwindcss|ngtw/)) {
        packageJSON.scripts.start += ' & ngtw watch'
      } else {
        console.log('Skipping start script')
      }

      if (!packageJSON.scripts.build) {
        packageJSON.scripts.build = 'ngtw build && ng build'
      } else if (!packageJSON.scripts.build.match(/ng-tailwindcss|ngtw/)) {
        packageJSON.scripts.build = 'ngtw build && ' + packageJSON.scripts.build
      } else {
        console.log('Skipping build script')
      }

      fs.writeFile(
        path.normalize(path.resolve(process.cwd(), 'package.json')),
        JSON.stringify(packageJSON, null, 2),
        err => err ? console.error(err) : console.log('Successfully Updated Scripts!')
      )
    }
  })
}
