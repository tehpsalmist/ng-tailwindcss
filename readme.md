# ng-tailwindcss
### A helpful cli tool for integrating tailwindcss into angular-cli projects with as little pain as possible

## Why Is This Necessary?

If you haven't used [Tailwind CSS](https://tailwindcss.com) yet, you really should! However, if you are trying to use Tailwind in an Angular project, you will quickly realize that the best features of tailwind are found in the build process, which is conveniently automated using postCSS plugins. Unfortunately, Angular currently does not offer developers access to the webpack/postcss configuration being used 'under the hood', so you're out of luck. Unless...

You use `ng eject`! _(loud booing ensues)_

Yes, using this excellent [SO answer](https://stackoverflow.com/questions/47381149/angular-4-tailwindcss-setup/#answer-47502171) or [YouTube video](https://www.youtube.com/watch?v=mUS0gclgO9Q), you can get at the postCSS controls and have a smooth tailwind build process and enjoy faster development speeds _when writing your styles_. But when you need a fancy new component and you type `ng g c complicated-but-awesome`, you'll quickly realize you just lost 5-10 minutes of your life when your terminal barks back,

  ```
  You're on your own, pal.
  ```

Ok, that's not quite what it says, but that's what it means, and `ng eject` is PERMANENT. I hope you really enjoy creating components by hand.

So, we just lost a huge development advantage (angular-cli) to gain another development advantage (cutting edge utility framework). You're probably not happy with this trade. I sure wasn't. Furthermore, `ng eject` was eliminated from Angular 6+. _(loud cheering)_

And that's where this CLI tool comes into play: with as few as 3 additional commands (2 if you don't count the install command), you can have Tailwind CSS in your Angular CLI project and hardly skip a beat in your development process.

Here's how:

## Quick and Dirty Setup
### _(Recommended for new projects only, see Configuration for safe handling of existing projects)_

After starting your new angular-cli project run these commands:

  ```
  npm i ng-tailwindcss -g
  npm i tailwindcss -D
  ./node_modules/.bin/tailwind init
  ng-tailwindcss configure
  touch src/tailwind.css
  ```

Put all your [tailwind imports](https://tailwindcss.com/docs/installation/#3-use-tailwind-in-your-css) in `src/tailwind.css` and run:

  ```
  ng-tailwindcss scripts
  ```

**Run `npm start` and let the wind fill your wings!**

## Full Installation and Usage Guide

1. Install globally:
  `npm i ng-tailwindcss -g`

2. If you don't already have an angular project up and running, start your angular project (assumes [angular cli](https://www.npmjs.com/package/@angular/cli) is already installed globally):
  `ng new angular-meets-tailwind`

3. Follow Steps 1-3 from the Tailwind Installation Instructions:
    - [Install Tailwind](https://tailwindcss.com/docs/installation#1-install-tailwind-via-npm) (`npm i tailwindcss -D`)
    - [initialize](https://tailwindcss.com/docs/installation#2-create-a-tailwind-config-file) (`./node_modules/.bin/tailwind init`)
    - [Use tailwind in your _source_ css files](https://tailwindcss.com/docs/installation#3-use-tailwind-in-your-css).

    A recommendation for new projects (no changes to global stylesheet yet) is to `touch src/tailwind.css` and use that file for all global styles and [component classes](https://tailwindcss.com/docs/extracting-components). See Configuration below for existing projects.

4. Configure your tailwind source/destination/config files by running:

    ```
    ng-tailwindcss configure --config ./path/to/whatever-you-named-tailwind-config.js --source ./path/to/your-tailwind-source.css --output ./path/to/outputted-global-styles.css
    ```

    This will result in an `ng-tailwind.js` file at your project's root:

    ```
    module.exports = {
      configJS: './path/to/whatever-you-named-tailwind-config.js',
      sourceCSS: './path/to/your-tailwind-source.css',
      outputCSS: './path/to/whatever-you-call-it.css'
    }
    ```

    For those curious, under the hood, these properties correspond to the paths used in the [tailwind build command](https://tailwindcss.com/docs/installation#4-process-your-css-with-tailwind) like so:

    ```
    ./node_modules/.bin/tailwind build {sourceCSS} -c {configJS} -o {outputCSS}
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

    or simply run `ng-tailwindcss scripts` to have these adjustments made automatically in your `package.json`.

    Now using `npm start` for your development server will ensure your tailwind files are being watched and built with your project, and you can still rely on the angular-cli for everything else (no `ng eject`! yay!).

6. Keep calm and angular on.

------

## Configuration
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

### A Few Notes About Existing Angular Projects
For existing projects that already have global stylesheets and other established CSS patterns, here are a few things to keep in mind:

- On each build, Tailwind will overwrite the `outputCSS` file, so be sure to only edit the `sourceCSS` file with your custom styles.

- Don't forget to adjust your angular.json `styles` array to reflect the `outputCSS` file, if you are using your original global stylesheet as your `sourceCSS` file.

- If you already have complicated start/build/production/etc scripts, then manually customizing these scripts should be preferred to running `ng-tailwindcss s`.

  - `ng-tailwindcss build` should be included _before_ any build process using `&&` to ensure all stylesheets are up-to-date before the angular build takes place.

    ex: `"build-prod": "ng-tailwindcss build && ng build --prod --aot"`

  - `ng-tailwindcss watch` should be coupled with the dev server command (`ng serve`) using a single `&` so the processes run concurrently and can be killed concurrently.

    ex: `"start": "ng serve & ng-tailwindcss watch"`

  - `ng-tailwindcss build` should also be included in a prestart script to ensure that styles are up-to-date before launching the dev server. If your dev server starts with a different command (with no `pre` option), consider:

    ex: `"custom dev command": "ng-tailwindcss build && fancy -dev -server -command & ng-tailwindcss watch`

Running into a scenario not covered in this documentation? [Open an issue!](https://github.com/tehpsalmist/ng-tailwindcss/issues/new)

### Resetting to defaults

The `--default` flag can be included with the `configure` command at any time to overwrite all properties to the defaults (see below), with the exception of any other included flags when the command is run.

Example:

  ```
  // ng-tailwind.js (hmm, needs an update)
  module.exports = {
    configJS: './some-tailwind-config.js',
    sourceCSS: ''./random/path/you/chose/tailwind.css',
    outputCSS: './way/different/location/of/styles.css'
  }

  // bash script (this should fix it):
  > ng-tailwindcss configure --default -o ./src/my-groovy-styles.css

  // ng-tailwind.js (updated)
  module.exports = {
    configJS: './tailwind.js', // default config value
    sourceCSS: './src/tailwind.css', // default source value
    outputCSS: './src/my-groovy-styles.css' // -o (--output) option from above command
  }
  ```

### Command Aliases

You can alias your commands or argument flags thus:

  ```
  configure => c
    --config => -c
    --source => -s
    --output => -o
    --default => -d

  watch => w
  build => b
  scripts => s
  --help => -h
  ```
including `--help` will provide a description of any command or argument.

## Contributing

Yes, please.