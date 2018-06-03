# ng-tailwindcss
### A helpful cli tool for integrating tailwindcss into angular-cli projects with as little pain as possible

## Quick and Dirty (for new projects only!)

After starting your new angular-cli project run these commands:

  ```
  npm i ng-tailwindcss -g
  npm i tailwindcss -D
  ./node_modules/.bin/tailwind init
  ng-tailwindcss configure
  touch src/tailwind.css 
  ```

Put all your [tailwind imports](https://tailwindcss.com/docs/installation/#3-use-tailwind-in-your-css) in `src/tailwind.css` and add/adjust these scripts in your package.json:

  ```
  scripts: {
    "prestart": "ng-tailwindcss build",
    "start": "ng serve & ng-tailwindcss watch",
    "build": "ng-tailwindcss build && ng build"
  }
  ```

Run `npm start` and let the wind fill your wings!

## Full Installation and Usage Guide

1. Install globally:
  `npm i ng-tailwindcss -g`

2. If you don't already have a project up and running, start your angular project (assumes angular cli is already installed globally):
  `ng new angular-meets-tailwind`

3. Follow Steps 1-3 from the Tailwind Installation Instructions: [Install Tailwind](https://tailwindcss.com/docs/installation#1-install-tailwind-via-npm) (`npm i tailwindcss -D`) and [initialize](https://tailwindcss.com/docs/installation#2-create-a-tailwind-config-file) (`./node_modules/.bin/tailwind init`) and [use tailwind in your _source_ css files](https://tailwindcss.com/docs/installation#3-use-tailwind-in-your-css).
A recommendation for new projects (no prior stylesheet changes) is to `touch src/tailwind.css` and use that file for all global styles and [component classes](https://tailwindcss.com/docs/extracting-components).

4. Configure your tailwind source/destination/config files by running:

  ```
  ng-tailwindcss configure --config ./path/to/whatever-you-named-tailwind-config.js --source ./path/to/your-tailwind-source.css --output ./path/to/whatever-you-call-it.css
  ```

  You can alias your commands or argument flags thus:

  ```
  configure => c
    --config => -c
    --source => -s
    --output => -o

  watch => w
  build => b
  ```

  This will result in an `ng-tailwind.js` file at your project's root:

  ```
  module.exports = {
    configJS: './path/to/whatever-you-named-tailwind-config.js',
    sourceCSS: './path/to/your-tailwind-source.css',
    outputCSS: './path/to/whatever-you-call-it.css'
  }
  ```

  _See Configuration Below for More Details and Implications for Existing Angular Projects_

5. Add or adjust these scripts in your package.json:

  ```
  scripts: {
    "prestart": "ng-tailwindcss build",
    "start": "ng serve & ng-tailwindcss watch",
    "build": "ng-tailwindcss build && ng build"
  }
  ```

  Now using `npm start` for your development server will ensure your tailwind files are being watched and built with your project, and you can still rely on the angular-cli for everything else (no `ng eject`! yay!).

6. Keep calm and angular on.

------

### Configuration
The `ng-tailwind.js` file can be directly manipulated (in keeping with the tailwind way of doing things) after the initial configuration command has been run. Conversely, if you prefer the command line, running `ng-tailwindcss configure` a second time will overwrite only the properties specified by the flags you include (e.g. `ng-tailwindcss configure -c ./new-tailwind-config.js` will only change the `configJS` property, and retain the original values for `sourceCSS` and `outputCSS`).

_*Important*: The default config (running_ `ng-tailwindcss configure` _with no arguments) will assume a configuration of:_
  ```
  {
    configJS: './tailwind.js',
    sourceCSS: ''./src/tailwind.css',
    outputCSS: './src/styles.css'
  }
  ```

It should be noted that such a configuration will set up your project to overwrite angular's default `styles.css` during each build, so if you desire to use the defaults in your existing project (recommended), you should remove any css from this file and place it in `sourceCSS` (the default being `src/tailwind.css`). If you are using `styles.css` as a source file (not really recommended), don't forget to edit your angular.json `styles` array to reflect your new global stylesheet (probably your `outputCSS`, but more complicated scenarios are certainly possible--be safe out there!).

## Contributing

Yes, please.