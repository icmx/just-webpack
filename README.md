# 🛠️ Just Webpack

> Outdated
>
> This project uses outdated technologies and is not recommended for use in modern development.

Bare minimum boilerplate featuring Webpack, EJS and PostCSS, all live-reloadable.

## Features

  - Webpack as a bundler
  - Basic EJS templating (HtmlWebpackPlugin)
  - PostCSS with csso minification and "include" import
  - Webpack Dev Server live-reloading preview

## Usage

Clone this repository:

```sh
git clone https://github.com/icmx/just-webpack
```

Go to local saved copy:

```sh
cd just-webpack
```

Install dependencies:

```sh
npm install
```

Launch it on [localhost:1337](http://localhost:1337/) — happy coding!

```sh
npm run watch
```

## Structure

All sources are in `src` directory, but any path can be easily changed in [webpack.config.js](webpack.config.js).

  - `assets` — *almost-compiled* binary files like images, icon sets, fonts etc. By default it contains only `images` subdirectory.
  - `static` — ready and compiled files, like favicons, robots.txt etc.
  - `app` — application code
  - `index.html` — index file
  - `index.js` — app index file
  - `index.css` — styles index file

All files will be bundled into HTML, CSS and JS bundles, while assets and static files will be just copied:

| Sources (`src`)                  | Output (`dist`)                  |
| -------------------------------- | -------------------------------- |
| `assets/*`                       | `/assets/*`                      |
| `static/*`                       | `/*`                             |
| `index.html`                     | `/index.html`                    |
| `app` (optional), `index.js`     | `/main.min.js`, `/vendor.min.js` |
| `styles` (optional), `index.css` | `/style.min.css`                 |

## Motivation

There are lots of similar boilerplates already indeed. However, most of them are incredibly bloated by endless dependencies, which may be deprecated, outdated and not even used at all, thus I suppose there should be some really lightweight and easy to use alternative.

Please note that packages choice for Just Webpack not only *bare*, but also *sane* — this project is not about making it as small as possible.

## See also

  - [Just Gulp](https://github.com/icmx/just-gulp) — same project, but gulp-based.
  - [Just Monorepo](https://github.com/icmx/just-monorepo) — minimal monorepository boilerplate built with NPM workspaces
