# XP

This is an attempt to experiment with new ways to facilitate experience development within the deliver platform

## demo
![xp-demo](https://cloud.githubusercontent.com/assets/640611/14802248/bf9cc210-0b47-11e6-9866-ec2050dbd1b0.gif)


### extension
1. go to chrome://extensions
2. load and enable the extension at ./chrome-extension

### server
```
npm install -g qubitdigital/xp-cli
mkdir some-experiment
cd some-experiment
xp
```

notes:
- xp will create example files in the current working directory if they don't already exist
- the default activation rule is that the url contains 'activate'
- xp will not execute until window.__qubit is detected


```
files:
- activation.js // develop advanced activations
- global.js // develop global code
- execution.js // develop execution code
- variation.css // develop variation css (this is actually less)
```

you can use this workflow to:
- build tests locally in your local editor
- write and run local unit tests
- benefit from features such as live reload while developing


```
changelog:
- the project is now called xp-cli and lives at http://github.com/qubitdigital/xp-cli
- the executable is now called xp, so you type xp instead of experience-previewer
- you don't need a querystring param anymore, it executes on every page
- activation.js, execution.js and global.js are now semantically identical to webapp, you can copy/paste between them (no need for module.exports, no need to do require = window.__qubit.amd.require and global.js executes in global context)
- xp will automatically wait until window.__qubit is defined
- variation.css supports less
- the index.js boilerplate is no longer required
- xp auto scaffolds missing files in the current directory when run
```
