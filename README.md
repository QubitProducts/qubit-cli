# Experience previewer

This is an attempt to experiment with new ways to facilitate experience development within the deliver platform

## demo

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
- index.js // develop execution code
- variation.css // develop variation css
```

you can use this workflow to:
- build tests locally in your local editor
- write and run local unit tests
- benefit from features such as live reload while developing
