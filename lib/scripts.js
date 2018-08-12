const fs = require('fs')
const path = require('path')

module.exports = () => {
  fs.readFile(path.resolve(process.cwd(), 'package.json'), (err, data) => {
    if (err) {
      throw err
    } else {
      const packageJSON = JSON.parse(data)
      if (!packageJSON.scripts) packageJSON.scripts = {}
      if (!packageJSON.scripts.prestart) {
        packageJSON.scripts.prestart = 'ng-tailwindcss build'
      } else if (!packageJSON.scripts.prestart.match(/ng-tailwindcss|ngtw/)) {
        packageJSON.scripts.prestart = 'ng-tailwindcss build && ' + packageJSON.scripts.prestart
      } else console.log('escaped prestart')
      if (!packageJSON.scripts.start) {
        packageJSON.scripts.start = 'ng serve & ng-tailwindcss watch'
      } else if (!packageJSON.scripts.start.match(/ng-tailwindcss|ngtw/)) {
        packageJSON.scripts.start += ' & ng-tailwindcss watch'
      } else console.log('escaped start')
      if (!packageJSON.scripts.build) {
        packageJSON.scripts.build = 'ng-tailwindcss build && ng build'
      } else if (!packageJSON.scripts.build.match(/ng-tailwindcss|ngtw/)) {
        packageJSON.scripts.build = 'ng-tailwindcss build && ' + packageJSON.scripts.build
      } else console.log('escaped build')
      fs.writeFile(path.resolve(process.cwd(), 'package.json'), JSON.stringify(packageJSON, null, 2), err => {
        if (err) throw err
        else console.log('Successfully Updated Scripts!')
      })
    }
  })
}
