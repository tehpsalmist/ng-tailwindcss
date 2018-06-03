const exec = require('child_process').exec
const fs = require('fs')

module.exports = () => {
  exec(`rm ./uniqueTestFile.js`, err => err ? console.error(err) : console.info('all clear!'))
}