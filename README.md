# ![xp-logo](./logo.png)

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
Usage: xp [options]

Options:

  -h, --help         output usage information
  -V, --version      output the version number
  -p, --port [port]  use custom [port] //  note you need to manually modify the extension for this to work
  -w, --wait         wait for window.__qubit.amd
```

```
notes:
- xp will produce sample files in the current folder if they are missing
- the default activation rule is that the url contains 'activate'
- xp will not execute until window.__qubit.amd is detected
- when running experiences over https protocol, click the shield in the address bar to allow loading the script
```
