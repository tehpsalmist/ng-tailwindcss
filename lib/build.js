const exec = require("child_process").exec;
const fs = require("fs");
const path = require("path");
const purge = require("./purge");

let sass = null;
function getSass() {
  // Conditionally require node-sass or dart-sass
  const pathToNodeSass = path.normalize(
    path.resolve(process.cwd(), "node_modules", "node-sass")
  );
  const pathToDartSass = path.normalize(
    path.resolve(process.cwd(), "node_modules", "sass")
  );

  try {
    sass = require(pathToNodeSass);
  } catch (err) {
    try {
      sass = require(pathToDartSass);
    } catch (e) {
      sass = null;
    }
  }
}

function twBuild(sourceFile, config, configPath, purgeFlag) {
  return new Promise((resolve, reject) =>
    exec(
      `${path.normalize(
        "./node_modules/.bin/tailwind"
      )} build "${sourceFile}" -c "${config.configJS}" -o "${
        config.outputCSS
      }"`,
      err => {
        if (err) return reject(err);

        console.info("Successful Tailwind Build!");
        // TODO: review this in watch mode
        // if (config.purge || purgeFlag) purge({ configPath });
        return resolve(sourceFile);
      }
    )
  );
}

function sassBuild(config, configPath) {
  return new Promise((res, rej) => {
    getSass();
    if (!sass) {
      rej("No scss preinstalled");
    }
    console.warn({ config });
    sass.render(
      {
        file: config.sourceCSS
      },
      (err, result) => {
        if (err) return rej(err);

        const tempFile = configPath
          ? path.normalize(
              path.resolve(
                process.cwd(),
                configPath.replace(
                  /([\w\-.]+[-.][\w\-.]+\.(\w+))/,
                  "temporary-tailwind-css-file.css"
                )
              )
            ) // puts temp file in same dir as config file
          : path.normalize(
              path.resolve(process.cwd(), "temporary-tailwind-css-file.css")
            );

        fs.writeFile(tempFile, result.css, err =>
          err ? rej(err) : console.info("Sass Compiled.") || res(tempFile)
        );
      }
    );
  });
}

function removeFile(file) {
  if (fs.existsSync(file)) {
    fs.unlink(file, err => err && console.error(err));
  }
}
module.exports = ({ purgeFlag, configPath }) => {
  return new Promise((res, rej) => {
    const ngTwFile = configPath
      ? path.normalize(path.resolve(process.cwd(), configPath))
      : path.normalize(path.resolve(process.cwd(), "ng-tailwind.js"));
    const config = fs.existsSync(ngTwFile) && require(ngTwFile);
    if (config) {
      if (config.sass) {
        sassBuild(config, configPath)
          .then(response => {
            return twBuild(response, config, configPath, purgeFlag);
          })
          .then(removeFile)
          .catch(err => err && console.error(err));
      } else {
        twBuild(config.sourceCSS).catch(err => err && console.error(err));
      }
    } else {
      rej(`No ng-tailwind.js file found at ${ngTwFile}.
  Please run \`ngtw configure\` in your project's root directory.
  Run \`ngtw --help\` for assistance,
  or view the Readme at https://github.com/tehpsalmist/ng-tailwindcss`);
    }
  });
};
