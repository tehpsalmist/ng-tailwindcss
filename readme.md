# ng-tailwindcss
### A helper module for integrating tailwindcss with angular-cli projects with as little pain as possible

## Installation

1. Install globally:
  `npm i ng-tailwindcss -g`

2. Start your angular project (assumes angular cli is already installed globally):
  `ng new angular-meets-tailwind`

3. [Install Tailwind](https://tailwindcss.com/docs/installation#1-install-tailwind-via-npm) (`npm i tailwindcss -D`) and [initialize](https://tailwindcss.com/docs/installation#2-create-a-tailwind-config-file) (`./node_modules/.bin/tailwind init`)

4. Adjust these scripts in your package.json:
  ```
  scripts: {
    "prestart": "ng-tailwindcss",
    "start": "ng serve & ng-tailwindcss",
    "build": "ng-tailwindcss && ng build",
  }
  ```
  Now using `npm start` for your development server will ensure your tailwind files are being watched and built with your project, and you can still rely on the angular-cli for everything else (no `ng eject`! yay!).
4. Keep calm and angular on.

## Configuration
_*Important: The default config (running ng-tailwindcss with no flags) will assume