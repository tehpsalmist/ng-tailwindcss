#!/usr/bin/env node

const program = require('commander')
const watch = require('./lib/watch')
const build = require('./lib/build')
const scripts = require('./lib/scripts')
const configure = require('./lib/configure')

program
  .command('build')
  .alias('b')
  .description('Builds Tailwind')
  .action((cmd) => {
    build()
  })

program
  .command('watch')
  .alias('w')
  .description('Watches Tailwind files and rebuilds on changes')
  .action((cmd) => {
    watch()
  })

program
  .command('configure')
  .alias('c')
  .description('Configures your tailwind setup using 3 arguments or the default setup')
  .option('-c, --config <config>', 'relative path to tailwind config js file')
  .option('-s, --source <source>', 'relative path to css source files')
  .option('-o, --output <output>', 'relative path to css output files (Angular global stylesheet)')
  .option('-d, --default', 'overwrites ng-tailwind.js file to default paths except any concurrent arguments')
  .action((args) => {
    const ngTwConfig = {}
    if (args.config) ngTwConfig.configJS = args.config
    if (args.source) ngTwConfig.sourceCSS = args.source
    if (args.output) ngTwConfig.outputCSS = args.output
    configure(ngTwConfig, args.default)
  })

program
  .command('scripts')
  .alias('s')
  .description('Automatically inserts the default build/serve/watch scripts into your package.json')
  .action((cmd) => {
    scripts()
  })

program.parse(process.argv)
