const fs = require('fs')
const path = require('path')
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

      strictEqual(configJS, 'tailwind.config.js')
      strictEqual(sourceCSS, 'src\\tailwind.css')
      strictEqual(outputCSS, 'src\\styles.css')
    },
    cleanup: () => {
      deleteNgTailwindJS()
    }
  })

  register('set user-defined paths correctly on windows OS', {
    test: async () => {
      await configure({
        configJS: path.normalize('./my/path/to/tailwind.config.js'),
        sourceCSS: path.normalize('C:\\Users\\Me\\AppData\\Roaming\\ATT\\lol\\src\\tailwind.css'),
        outputCSS: path.normalize('.\\windows\\sucks.css')
      })

      const { configJS, sourceCSS, outputCSS } = require('./ng-tailwind')

      strictEqual(configJS, 'my\\path\\to\\tailwind.config.js')
      strictEqual(sourceCSS, 'C:\\Users\\Me\\AppData\\Roaming\\ATT\\lol\\src\\tailwind.css')
      strictEqual(outputCSS, 'windows\\sucks.css')
    },
    cleanup: () => {
      deleteNgTailwindJS()
    }
  })

  register('rewrite paths from existing config correctly on windows OS', {
    setup: () => {
      fs.writeFileSync('./ng-tailwind.js', `module.exports = {
        configJS: 'my/path/to/existing/tailwind.config.js',
        sourceCSS: 'C:\\\\Users\\\\Me\\\\folder\\\\existing\\\\src\\\\tailwind.css',
        outputCSS: '.\\\\existing\\\\unix\\\\style.css'
      }`)
    },
    test: async () => {
      await configure({
        configJS: path.normalize('./new/path/to/tailwind.config.js')
      })

      delete require.cache[require.resolve('./ng-tailwind.js')]

      const { configJS, sourceCSS, outputCSS } = require('./ng-tailwind')

      strictEqual(configJS, 'new\\path\\to\\tailwind.config.js')
      strictEqual(sourceCSS, 'C:\\Users\\Me\\folder\\existing\\src\\tailwind.css')
      strictEqual(outputCSS, '.\\existing\\unix\\style.css')
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

      strictEqual(configJS, 'tailwind.config.js')
      strictEqual(sourceCSS, 'src/tailwind.css')
      strictEqual(outputCSS, 'src/styles.css')
    },
    cleanup: () => {
      deleteNgTailwindJS()
    }
  })

  register('set user-defined paths correctly on unix systems', {
    test: async () => {
      await configure({
        configJS: path.normalize('my/path/to/tailwind.config.js'),
        sourceCSS: path.normalize('/Users/me/projects/stupid/name/src/tailwind.css'),
        outputCSS: path.normalize('./windows/sucks.css')
      })

      const { configJS, sourceCSS, outputCSS } = require('./ng-tailwind')

      strictEqual(configJS, 'my/path/to/tailwind.config.js')
      strictEqual(sourceCSS, '/Users/me/projects/stupid/name/src/tailwind.css')
      strictEqual(outputCSS, 'windows/sucks.css')
    },
    cleanup: () => {
      deleteNgTailwindJS()
    }
  })

  register('rewrite paths from existing config correctly on unix systems', {
    setup: () => {
      fs.writeFileSync('./ng-tailwind.js', `module.exports = {
        configJS: 'my/path/to/existing/tailwind.config.js',
        sourceCSS: '/Users/me/projects/existing/src/tailwind.css',
        outputCSS: './existing/unix/style.css'
      }`)
    },
    test: async () => {
      await configure({})

      delete require.cache[require.resolve('./ng-tailwind.js')]

      const { configJS, sourceCSS, outputCSS } = require('./ng-tailwind')

      strictEqual(configJS, 'my/path/to/existing/tailwind.config.js')
      strictEqual(sourceCSS, '/Users/me/projects/existing/src/tailwind.css')
      strictEqual(outputCSS, './existing/unix/style.css')
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

  failures.forEach(([d, f]) => console.log(`${d}:\n`, f))
  console.log(`${tests.length - failures.length} / ${tests.length} tests pass!`)

  return process.exit(failures.length ? 1 : 0)
}

function deleteNgTailwindJS () {
  delete require.cache[require.resolve('./ng-tailwind.js')]
  return fs.unlinkSync('./ng-tailwind.js')
}
