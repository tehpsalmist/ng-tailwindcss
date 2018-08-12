#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const watch = require('./lib/watch')
const build = require('./lib/build')
const scripts = require('./lib/scripts')
const configure = require('./lib/configure')
const purge = require('./lib/purge')

program
  .command('build')
  .alias('b')
  .description('Builds Tailwind')
  .option('-p, --purge', 'run PurgeCSS with this build')
  .action((args) => {
    build({ purgeFlag: args.purge })
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
  .description('Configure your tailwind setup using custom arguments or the default setup;\n\tRestart of development server required for changes to take effect')
  .option('-c, --config <config>', 'relative path to tailwind config js file')
  .option('-s, --source <source>', 'relative path to css source files')
  .option('-o, --output <output>', 'relative path to css output files (Angular global stylesheet)')
  .option('-d, --default', 'overwrites ng-tailwind.js file to default paths except any concurrent arguments')
  .option('-p, --purge', 'Sets `purge: true` in ng-tailwind.js, causing every build to run PurgeCSS, even during development')
  .option('--unset-purge', 'Sets `purge: false` in ng-tailwind.js, which is the default configuration')
  .action((args) => {
    if (args.purge && args.unsetPurge) {
      return console.error('To purge or not to purge...make up your mind.')
    }
    const ngTwConfig = {}
    if (args.config) ngTwConfig.configJS = path.resolve(args.config)
    if (args.source) ngTwConfig.sourceCSS = path.resolve(args.source)
    if (args.output) ngTwConfig.outputCSS = path.resolve(args.output)
    if (args.hasOwnProperty('purge') || args.unsetPurge) ngTwConfig.purge = args.purge || false
    configure(ngTwConfig, args.default)
  })

program
  .command('scripts')
  .alias('s')
  .description('Automatically inserts the default build/serve/watch scripts into your package.json')
  .action((cmd) => {
    scripts()
  })

program
  .command('purge')
  .alias('p')
  .description('Run PurgeCSS on your output file to eliminate unused CSS selectors')
  .action((cmd) => {
    purge()
  })

program.parse(process.argv)
