#!/usr/bin/env node
const chokidar = require('chokidar')
const child = require('child_process')
const minimist = require('minimist')
const argv = minimist(process.argv)

const configFile = argv.config || argv.c || './tailwind.js'
const sourceCSS = argv.source || argv.s || './src/tailwind.css'
const destCSS = argv.dest || argv.d || './src/styles.css'

console.log(sourceCSS, configFile, destCSS);

const tailwind = chokidar.watch([configFile, sourceCSS])

tailwind.on('change', (event, path) => {
  console.log('Reprocessing Tailwind Files')
  child.exec(`./node_modules/.bin/tailwind build ${sourceCSS} -c ${configFile} -o ${destCSS}`)
})
