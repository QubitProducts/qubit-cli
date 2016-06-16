# ![xp-logo](./logo.png)

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

A client to facilitate the local development of experiences for the qubit platform

- build experiences locally in your editor/ide of choice
- write and run local unit tests
- bypass the build queue
- execute/demo on sites that don't have qubit tech
- live reload


## Usage

### 1) install extension
1. go to chrome://extensions
2. load and enable the extension at ./chrome-extension

### 2) run cli
```
npm install -g qubitdigital/xp-cli
mkdir dev-123
cd dev-123
xp
// navigate to some experiment in your web browser
```

```
files:
- activation.js // develop advanced activations
- global.js // develop global code
- execution.js // develop execution code
- variation.css // develop variation css/less
```

```
Usage: xp [options] [command]


Commands:

  open   open xp folder in finder, e.g. to locate chrome-extension

Options:

  -h, --help         output usage information
  -V, --version      output the version number
  -p, --port [port]  use custom [port]
  -r, --require      wait for window.__qubit.amd
  -w, --watch        watch for file changes and auto refresh on change
```

notes:
- xp will produce sample files in the current folder if they are missing
- the default activation rule is that the url contains 'activate'
- to make xp wait for window.__qubit.amd to be present, use the 'require' flag: ``` xp --require
- if it isn't working after an update, try reloading the extension
 ```
