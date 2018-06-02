# ng-tailwindcss
### A helper module for integrating tailwindcss with angular-cli projects with as little pain as possible

## Installation

1. Install globally:
  `npm i ng-tailwindcss -g`

2. If you don't already have a project up and running, start your angular project (assumes angular cli is already installed globally):
  `ng new angular-meets-tailwind`

3. Follow Steps 1-3 from the Tailwind Installation Instructions: [Install Tailwind](https://tailwindcss.com/docs/installation#1-install-tailwind-via-npm) (`npm i tailwindcss -D`) and [initialize](https://tailwindcss.com/docs/installation#2-create-a-tailwind-config-file) (`./node_modules/.bin/tailwind init`) and [use tailwind in your _source_ css files](https://tailwindcss.com/docs/installation#3-use-tailwind-in-your-css).
A recommendation for new projects (no prior stylesheet changes) is to `touch src/tailwind.css` and use that file for all global styles and [component classes](https://tailwindcss.com/docs/extracting-components).

4. Configure your tailwind source/destination/config files by running:
  `ng-tailwindcss configure --config ./path/to/whatever-you-named-tailwind-config.js --source ./path/to/your-tailwind-source.css --dest ./path/to/whatever-you-call-it.css`
  This will result in an ng-tailwindcss.js file at your project root:
  ```
  module.exports = {
    configFile: './path/to/whatever-you-named-tailwind-config.js',
    sourceCSS: './path/to/your-tailwind-source.css',
    destCSS: './path/to/whatever-you-call-it.css'
  }
  _See Configuration Below for More Details and Implications for Existing Angular Projects_

5. Adjust these scripts in your package.json:
  ```
  scripts: {
    "prestart": "ng-tailwindcss",
    "start": "ng serve & ng-tailwindcss",
    "build": "ng-tailwindcss && ng build"
  }
  ```
  Now using `npm start` for your development server will ensure your tailwind files are being watched and built with your project, and you can still rely on the angular-cli for everything else (no `ng eject`! yay!).

6. Keep calm and angular on.

## Configuration
_*Important*: The default config (running ng-tailwindcss with no flags) will assume a configuration of:_
  ```
  {
    configFile: './tailwind.js',
    sourceCSS: ''./src/tailwind.css',
    destCSS: './src/styles.css'
  }
  ```
It should be noted that such a configuration will overwrite the