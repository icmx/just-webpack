# Just Webpack

Bare minimum boilerplate featuring Webpack, basic EJS templating and Sass styling, all live-reloadable.

## Features

  - Webpack as a bundler
  - Basic EJS templating
  - Dart Sass styles preprocessing
  - PostCSS with cssnano minification enabled
  - Webpack Dev Server live-reloading preview
  - Prettier project-specific editor settings

## Usage

```sh
# clone repository
git clone https://github.com/icmx/just-webpack

# go to local copy
cd just-webpack

# install dependencies
npm install

# launch it on localhost:1337 -- happy coding!
npm run serve

# build it
npm run build
```

## Structure

All sources are in `src` directory, but any path can be easily changed in [webpack.config.js](webpack.config.js).

  - `assets` — *almost-compiled* binary files like images, icon sets, fonts etc. By default it contains only `images` subdirectory.
  - `static` — ready and compiled files, like favicons, robots.txt etc.
  - `app` — application code
  - `styles` — additional styles and other SCSS files
  - `index.html` — index file
  - `index.js` — app index file
  - `index.scss` — styles index file

All files will be bundled into HTML, CSS and JS bundles, while assets and static files will be just copied:

| Sources (`src`)                   | Output (`dist`)                  |
| --------------------------------- | -------------------------------- |
| `assets/*`                        | `/assets/*`                      |
| `static/*`                        | `/*`                             |
| `index.html`                      | `/index.html`                    |
| `app` (optional), `index.js`      | `/main.min.js`, `/vendor.min.js` |
| `styles` (optional), `index.scss` | `/style.min.css`                 |

## Motivation

There are lots of similar boilerplates already indeed. However, most of them are incredibly bloated by endless dependencies, which may be deprecated, outdated and even not used at all, thus I suppose there should be some really lightweight and easy to use alternative.

Please note that packages choice for Just Webpack not only *bare*, but also *sane*.

## See also

  - [Just Gulp](https://github.com/icmx/just-gulp) — same project, but gulp-based.
