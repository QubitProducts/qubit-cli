# XP

This is an attempt to experiment with new ways to facilitate experience development within the deliver platform

## demo
![xp-demo](https://cloud.githubusercontent.com/assets/640611/14802248/bf9cc210-0b47-11e6-9866-ec2050dbd1b0.gif)


### extension
1. go to chrome://extensions
2. load and enable the extension at ./chrome-extension

### server
```
npm link
cd ./example
xp
```
now open any page and add 'activate' to the url querystring or hash

```
- activation.js // develop advanced activations
- global.js // develop global code
- execution.js // develop execution code
- variation.css // develop variation css
```

you can use this workflow to:
- build tests locally in your local editor
- write and run local unit tests
- benefit from features such as live reload while developing


```
changes:
- the project is now called xp-cli and lives at http://github.com/qubitdigital/xp-cli
- you don't need a querystring param anymore, it executes on every page
- activation.js, execution.js and global.js are now semantically identical to webapp, you can copy/paste between them (no need for module.exports, no need to do require = window.__qubit.amd.require and global.js executes in global context)
- xp will automatically wait until window.__qubit is defined
- the executable is now called xp, so you type xp instead of experience-previewer
- variation.css supports less
- the index.js boilerplate is no longer required
```
