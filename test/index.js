const fs = require('fs')
const { strictEqual } = require('assert')
const configure = require('../lib/configure')

const tests = []
const failures = []

process.chdir('./test')

// windows tests
if (process.platform === 'win32') {
  register('set paths correctly on windows OS', {
    test: async () => {
      await configure({})

      const { configJS, sourceCSS, outputCSS } = require('./ng-tailwind')

      console.log(configJS, sourceCSS, outputCSS)

      strictEqual(configJS, 'tailwind.config.js')
      strictEqual(sourceCSS, 'src\\tailwind.css')
      strictEqual(outputCSS, 'src\\styles.css')
    },
    cleanup: () => {
      deleteNgTailwindJS()
    }
  })
}

// unix tests
if (process.platform === 'darwin' || process.platform === 'linux') {
  register('set paths correctly on unix systems', {
    test: async () => {
      await configure({})

      const { configJS, sourceCSS, outputCSS } = require('./ng-tailwind')

      console.log(configJS, sourceCSS, outputCSS)

      strictEqual(configJS, 'tailwind.config.js')
      strictEqual(sourceCSS, 'src/tailwind.css')
      strictEqual(outputCSS, 'src/styles.css')
    },
    cleanup: () => {
      deleteNgTailwindJS()
    }
  })
}

evaluateTests()

function register (description, { test, cleanup, setup }) {
  tests.push({ description, test, setup, cleanup })
}

async function run ({ description, test, setup, cleanup }) {
  try {
    if (typeof setup === 'function') {
      await setup()
    }

    await test()
  } catch (error) {
    failures.push([description, error.message])
  }

  if (typeof cleanup === 'function') {
    try {
      cleanup()
    } catch (e) {
      console.error(`cleanup broken for ${description}`, e)
    }
  }
}

async function evaluateTests () {
  for (const suite of tests) {
    await run(suite)
  }

  failures.forEach(([d, f]) => console.log(`${d}:`, f))
  console.log(`${tests.length - failures.length} / ${tests.length} tests pass!`)

  return process.exit(failures.length ? 1 : 0)
}

function deleteNgTailwindJS () {
  return fs.unlinkSync('./ng-tailwind.js')
}
