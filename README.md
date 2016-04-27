# Experience previewer

This is an attempt to experiment with new ways to facilitate experience development within the deliver platform

## demo
![experience-preview-demo](https://cloud.githubusercontent.com/assets/640611/14802248/bf9cc210-0b47-11e6-9866-ec2050dbd1b0.gif)


### extension
1. go to chrome://extensions
2. load and enable the extension at ./chrome-extension

### server
```
npm link
cd ./example
experience-previewer
```
now open any page and add 'local_experience_previewer&activate' to the url querystring or hash

```
- activation.js // develop advanced activations
- global.js // develop global code
- execution.js // develop execution code
- variation.css // develop variation css
- index.js // entry point
```

you can use this workflow to:
- build tests locally in your local editor
- write and run local unit tests
- benefit from features such as live reload while developing

### some extra hacks
- to load modules from the page add
```
var require = window.__qubit.amd.require
```
to the top of your file (e.g. execution.js or activation.js)

- to share code between modules export an object from global.js and interact with it from each file - this is a shared instance

- if you're requiring modules and adding unit tests, you'll need to shim window.__qubit.require, see example/test/test-execution.js for how to do this
