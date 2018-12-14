# ng-tailwindcss
### A CLI tool for integrating Tailwind CSS into Angular-CLI projects with as little pain as possible

> _What's New (v1.2+):_
>
> - PurgeCSS, ready to rock, right out of the box!
>
> - Hot reloading when changes are made to ng-tailwind.js (like Purge whitelist additions/deletions)! [v.1.2.1+]
>
> - Sass support with optional dependency on node-sass

## Why Is This Necessary?

If you haven't used [Tailwind CSS](https://tailwindcss.com) yet, you really should! However, if you are trying to use Tailwind in an Angular project, you will quickly realize that the best features of tailwind are found in the build process, which is conveniently automated using (mostly) postCSS plugins. Unfortunately, Angular currently does not offer developers access to the webpack configuration being used 'under the hood', so you're out of luck. Unless...

You use `ng eject`! (not available in v6+)

If you are ok with losing all of the benefits of angular-cli (not advisable given the improvements continually being made to it), you can reference this excellent [SO answer](https://stackoverflow.com/questions/47381149/angular-4-tailwindcss-setup/#answer-47502171) or [YouTube video](https://www.youtube.com/watch?v=mUS0gclgO9Q) and learn how to get at the postCSS controls. Using this method, you will certainly enjoy faster development speed _when dealing with styles_. But when you reach for `ng generate`, `ng add`, or `ng upgrade` etc., you may find that you'll have some regrets, because running `ng eject` is PERMANENT. I hope you enjoy creating components 'by hand.'

However, if you're into having cake and eating it too, `ng-tailwindcss` is what you've been looking for! With a few straightforward CLI commands, you can retain the development advantage of angular-cli and enjoy all the benefits of the best CSS utility framework on the web. Oh, and did we mention PurgeCSS???

Let's get down to business:

## Quick and Dirty Setup
### _(Recommended for new projects only, see Configuration section for safe handling of existing projects)_

After starting your new angular-cli project run these commands:

  ```sh
  npm i ng-tailwindcss -g
  npm i tailwindcss -D
  ./node_modules/.bin/tailwind init
  ngtw configure
  touch src/tailwind.css
  ```

Put all your [tailwind imports](https://tailwindcss.com/docs/installation/#3-use-tailwind-in-your-css) in `src/tailwind.css` and run:

  ```sh
  ngtw scripts
  ```

**Run `npm start` and let the wind fill your wings!**

--------

## Full Installation and Usage Guide

1. Install globally:
  `npm i ng-tailwindcss -g`

2. If you don't already have an angular project up and running, start your angular project (assumes [angular cli](https://www.npmjs.com/package/@angular/cli) is already installed globally):
  `ng new angular-meets-tailwind`

3. Follow Steps 1-3 from the Tailwind Installation Instructions:
    - [Install Tailwind](https://tailwindcss.com/docs/installation#1-install-tailwind-via-npm) (`npm i tailwindcss -D`)
    - [initialize](https://tailwindcss.com/docs/installation#2-create-a-tailwind-config-file) (`./node_modules/.bin/tailwind init`)
    - [Use tailwind in your _source_ css files](https://tailwindcss.com/docs/installation#3-use-tailwind-in-your-css).

    A recommendation for new projects (no changes to global stylesheet yet) is to `touch src/tailwind.css` and use that file for all global styles and [component classes](https://tailwindcss.com/docs/extracting-components). See Configuration section for existing projects.

4. Configure your tailwind source/destination/config files by running:

    ```sh
    ngtw configure --config ./path/to/whatever-you-named-tailwind-config.js --source ./path/to/your-tailwind-source.css --output ./path/to/outputted-global-styles.css
    ```

    This will result in an `ng-tailwind.js` file at your project's root:

    ```js
    module.exports = {
      // Tailwind Paths
      configJS: '/Absolute/path/to/whatever-you-named-tailwind-config.js',
      sourceCSS: '/Absolute/path/to/your-tailwind-source.css',
      outputCSS: '/Absolute/path/to/outputted-global-styles.css',
      // Sass
      sass: false,
      // PurgeCSS Settings
      ...
    }
    ```

    _Please note that as of version 1.0.3, these paths will be absolute when created using the cli tool, though they can be manually edited to be relative paths with no adverse consequences._

    For those curious, under the hood, these properties correspond to the paths used in the [tailwind build command](https://tailwindcss.com/docs/installation#4-process-your-css-with-tailwind) like so:

    ```
    ./node_modules/.bin/tailwind build {sourceCSS} -c {configJS} -o {outputCSS}
    ```

    _See Configuration section for more details and implications for existing Angular projects_

5. Add or adjust these scripts in your package.json:

    ```json
    scripts: {
      "prestart": "ngtw build",
      "start": "ng serve & ngtw watch",
      "build": "ngtw build && ng build"
    }
    ```

    or simply run `ngtw scripts` to have these adjustments made automatically in your `package.json`.

    Now using `npm start` for your development server will ensure your tailwind files are being watched and built with your project, and you can still rely on the angular-cli for everything else (no `ng eject`! yay!).

6. When you're ready to filter out your unused CSS, reference the documentation below for the various ways you can implement and adjust PurgeCSS. (Quick Tip: To include PurgeCSS in your build script, simply adjust the `ngtw` build command like so: `ngtw build --purge`.)

7. Keep calm and angular on.

--------

## Configuration
The `ng-tailwind.js` file can be directly manipulated (in keeping with the tailwind way of doing things) after the initial configuration command has been run. Conversely, if you prefer the command line, running `ngtw configure` a second time will overwrite only the properties specified by the flags you include (e.g. `ngtw configure -c ./new-tailwind-config.js` will only change the `configJS` property, and retain the original values for `sourceCSS` and `outputCSS`).

_*Important*: The default config (running_ `ngtw configure` _with no arguments) will assume a configuration of:_

  ```js
  {
    // Tailwind Paths
    configJS: './tailwind.js',
    sourceCSS: './src/tailwind.css',
    outputCSS: './src/styles.css',
    // Sass
    sass: false,
    // PurgeCSS Settings
    ...
  }
  ```

_Also important: these paths will actually be coerced to absolute paths. If you find this confusing, please [open an issue](https://github.com/tehpsalmist/ng-tailwindcss/issues/new), so the docs can be as clear as necessary._

It should be noted that such a configuration will set up your project to overwrite angular's default `styles.css` during each build, so if you desire to use the defaults in your existing project (recommended), you should remove any css from this file and place it in `sourceCSS` (the default being `src/tailwind.css`). If you are using `styles.css` as a source file (not really recommended), don't forget to edit your angular.json `styles` array to reflect your new global stylesheet (probably your `outputCSS`, but more complicated scenarios are certainly possible--be safe out there!).

### Resetting to defaults

The `--default` flag can be included with the `configure` command at any time to overwrite all Tailwind Paths  to the defaults (see below; PurgeCSS Settings will not change), with the exception of any other included flags when the command is run.

Example:

  ng-tailwind.js (changed the file structure, needs an update)

  ```js
  module.exports = {
    // Tailwind Paths
    configJS: './some-tailwind-config.js',
    sourceCSS: './random/path/you/chose/tailwind.css',
    outputCSS: './way/different/location/of/styles.css'
    // Sass
    sass: false,
    // PurgeCSS Settings
    ...
  }
  ```

  bash script (this should fix it):

  ```sh
  ngtw configure --default -o ./src/my-groovy-styles.css
  ```

  ng-tailwind.js (updated)

  ```js
  module.exports = {
    // Tailwind Paths
    configJS: './tailwind.js', // default config value
    sourceCSS: './src/tailwind.css', // default source value
    outputCSS: './src/my-groovy-styles.css' // -o (--output) overrides default
    // Sass
    sass: false,
    // PurgeCSS Settings
    ...
  }
  ```

--------

## PurgeCSS Implementation Guide

### _How it Works_
It is important to note that PurgeCSS will manipulate the output CSS file itself, directly.

For example:

  - `ngtw build` produces =>
  - styles.css file of ~300kb (all possible selectors; results may vary) =>
  - `ngtw purge` takes in that stylesheet and =>
  - rewrites styles.css file of 6kb (same file location, but with only a fraction of the original selectors, and no comments)

"Ah, but how does PurgeCSS know what selectors I'm using?" you ask.

ng-tailwindcss uses a [custom extractor](https://tailwindcss.com/docs/controlling-file-size#removing-unused-css-with-purgecss) that is run against all .html and .ts files in the /src directory. You can edit your PurgeCSS configuration in the ng-tailwind.js file. Read the [PurgeCSS Docs](https://www.purgecss.com/configuration) to see what is possible and how to maximize the configuration for your project.

### _How To Use It_
When including PurgeCSS in your Angular/Tailwind magnum opus, there are 3 ways to execute the script:

1. **Lock It in at the Configuration Level**

    This strategy ensures that PurgeCSS will clean up your Tailwind-generated global stylesheet _every time Tailwind builds_.

    **Usage**: `ngtw configure --purge`
    
    This configure flag sets `{purge: true}` in your ng-tailwind.js file. This property defaults to `false`, but, when `true`, it will not be overridden by any other CLI commands that initiate a build. _**It is important to note that any PurgeCSS configuration options set to `true` in the ng-tailwind.js file will not be overridden by a CLI command._
    
    However, you can set `{purge: false}` at any time by manually editing the file (of course), or running `ngtw c --unset-purge`.

    Example: _PurgeCSS All The Things_

    ```sh
    ngtw configure --default --purge
    ngtw scripts

    # Even though the scripts command does not create any PurgeCSS scripts,
    # the configuration of {purge: true} in ng-tailwind.js will cause PurgeCSS
    # to run after every successful Tailwind build.
    ```

2. **Run It with the `ngtw` Build Command**

    This is a slightly more manual approach, where you are telling PurgeCSS to run with a flag on the build command.
    
    **Usage**: `ngtw build --purge`.
    
    Obviously, this tells tailwind to rebuild your stylesheet, then PurgeCSS is immediately excecuted on the resulting output file (`outputCSS` in ng-tailwind.js) using the settings specified in ng-tailwind.js.

    Example: _Production Build Script_
    
    ```js
    "scripts": {
      "b-dev": "ngtw build && ng build", // dont purge
      "b-prod": "ngtw build --purge && ng build -c production" // purge
    }
    ```

3. **Run the Command Directly**

    This gives you granular control over when PurgeCSS runs, as well as a few other options that can be altered with each execution.

    **Usage**: `ngtw purge [--keyframes] [--fontface] [--rejected]`

    At any time this command can be run to purge your `outputCSS` file. By default, the settings specified in your ng-tailwind.js file will be used, but any boolean properties (keyframes, fontface, rejected) that are `false` can be overridden to be `true` during this run with the use of the flags.

    Example: _Debugging Dynamically Generated Selectors_

    ```sh
    ngtw build && ngtw purge --rejected
    ```

    {project root}/rejectedCSS.json:

    ```js
    [
      ".dynamically-generated-class", // Ah! Forgot to whitelist this one!
      ".useless-class",
      "#useless-id",
      "etc..."
    ]
    ```

    ng-tailwind.js:

    ```js
    module.exports = {
      // Tailwind Paths
      configJS: './tailwind.js',
      sourceCSS: './src/tailwind.css',
      outputCSS: './src/styles.css',
      // Sass
      sass: false,
      // PurgeCSS Settings
      purge: false,
      keyframes: false,
      fontFace: false,
      rejected: false,
      whitelist: ['dynamically-generated-class'], // Problem solved
      whitelistPatterns: [/dynamically/, /generated/, /class/], // overkill, but also works
      whitelistPatternsChildren: []
    }
    ```

--------

## Using Sass

To take advantage of Sass in your `tailwind.(s)css` file, `node-sass` must be installed in your project (most likely included with your Angular app unless you removed it somehow, because you have way too much time on your hands). In the rare scenario it is not installed, run `npm i -O node-sass` in your project root (installs as optional dependency) and you're good to go.

Once this optional dependency is in place, configure for Sass with `ngtw c --sass`.

That's all! Keep in mind, this tool does not compile CSS/SCSS from any other files, so you'll still have to configure your `angular.json` for the rest, which is the preferred way to handle those files.

**_A note on how this is implemented:_** _The compiled CSS from your tailwind.scss is stored in a temporary `.css` file that is immediately destroyed once the build is complete. At the moment, there is no way to alter this behavior. If this is not optimal for your situaion, please [file an issue](https://github.com/tehpsalmist/ng-tailwindcss/issues/new)._

--------

## Upgrading from ng-tailwindcss =< 1.0.3

There are no breaking changes from 1.0.3 to 1.1.0+ or 1.2.0+, so all commands will continue to work as expected, but to take full advantage of PurgeCSS or Sass capabilities, simply install the latest version globally with `npm i -g ng-tailwindcss@latest`, then run `ngtw c` and your ng-tailwind.js file will automatically fill out with the default PurgeCSS settings properties (of course, you could manually add them too, if you're into that sort of thing). Even without updating ng-tailwind.js, running any variety of the purge command will still work (and use the default PurgeCSS Settings).

--------

## A Few Notes About Existing Angular Projects
For existing projects that already have global stylesheets and other established CSS patterns, here are a few things to keep in mind:

- On each build, Tailwind will overwrite the `outputCSS` file, so be sure to only edit the `sourceCSS` file with your custom styles.

- Don't forget to adjust your angular.json `styles` array to reflect the `outputCSS` file, if you are using your original global stylesheet as your `sourceCSS` file.

- If you already have complicated start/build/production/etc scripts, then _manually customizing these scripts should be preferred_ over running `ngtw s`.

  - `ngtw build` should be included _before_ any build process using `&&` to ensure all stylesheets are up-to-date before the angular build takes place.

    ex: `"build-prod": "ngtw build && ng build --prod --aot"`

  - `ngtw watch` should be coupled with the dev server command (`ng serve`) using a single `&` so the processes run concurrently and can be killed concurrently.

    ex: `"start": "ng serve & ngtw watch"`

  - `ngtw build` should also be included in a prestart script to ensure that styles are up-to-date before launching the dev server. If your dev server starts with a different command (with no `pre` option), consider:

    ex: `"custom dev command": "ngtw build && fancy -dev -server -command & ngtw watch`

Running into a scenario not covered in this documentation? [Open an issue!](https://github.com/tehpsalmist/ng-tailwindcss/issues/new)

--------

## Command Aliases

You can alias your commands or argument flags thus:

  ```
  ng-tailwindcss => ngtw

      configure => c
          --config => -c
          --source => -s
          --output => -o
          --default => -d
          --purge => -p
          --unset-purge (no alias)
          --sass (no alias, and must be manually set to false)

      build => b
          --purge => -p
      
      purge => p
          --keyframes => -k
          --fontface => -f
          --rejected => -r

      watch => w
      scripts => s

      --help => -h
  ```

including `--help` will provide a description of any command or argument.

--------

## Contributing

If you enjoy helping other developers get stuff done more efficiently, then we share a common goal, my friend. I would love to [hear your ideas](https://github.com/tehpsalmist/ng-tailwindcss/issues/new) to make this project better, or to review your pull requests.