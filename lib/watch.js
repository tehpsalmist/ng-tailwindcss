const chokidar = require('chokidar')
const build = require('./build')

const tailwind = chokidar.watch([configJS, sourceCSS])

tailwind.on('change', (event, path) => {
  console.log('Reprocessing Tailwind Files')
  build()
})