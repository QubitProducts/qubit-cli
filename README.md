# ![xp-cli](https://cloud.githubusercontent.com/assets/640611/18666410/a11b3394-7f23-11e6-99b5-5cbbca6da27f.png)

A client to facilitate local development of experiences for the qubit platform

## features

local offline development
- build experiences locally in your editor/IDE of choice
- use your own workflow and versioning tools
- write and run local unit tests

advanced previewing
- instant local previewing on any site
- live hot reloading of your variation and css
- bypass qubit's remote build queue

remote syncing
- scaffold your local project from existing experiences in the platform
- control when to push your changes up or pull down the latest remote changes
- develop your experience locally and choose when to share it
- use sync mode to watch for changes and sync with remote automatically

templates
- create templates to speed up local development
- publish templates to share ideas and examples with teammates
- save time and effort by automating boilerplate and common variation code
- improve code consistency and design by leveraging template reuse


## installation

client
```
npm install -g qubitdigital/xp-cli --production
```

extension
```
xp open
# navigate to chrome://extensions in chrome
# drag and drop chrome-extension folder into browser
# ensure 'enabled' checkbox is ticked
# click 'allow in incognito' if you would like to use xp in incognito mode
```

## basic usage

once you have installed the client and extension
```
mkdir xp-demo
cd xp-demo
xp pull example
xp variation.js --watch
// navigate to a url in chrome
// click the xp icon in chrome to turn the extension on for your current tab
```

## xp pull

xp pull allows you to scaffold an experience from a template or a remote experience:

by navigating to the experience:
```
$ xp pull
$ navigate to an `edit experience` page for xp to connect to it
$ open https://app.qubit.com/p/1234/experiences/5678/editor
  You recently navigated to https://app.qubit.com/p/1234/experiences/5678/editor
  Would you like xp to scaffold your local project from this experiment? (y/n)
  writing to local package.json file...
  writing to local global.js file...
  writing to local triggers.js file...
  writing to local variation-49937.js file...
  writing to local variation-49937.css file...
  writing to local variation-336711.js file...
  writing to local variation-336711.css file...
  All done!
```

// by pasting the editor url:
```
$ xp pull https://app.qubit.com/p/1234/experiences/5678/editor
  pulling...
  pulled!
```

// by explicitly passing in propertyId and experienceId
```
$ xp pull 1234 5678
  pulling...
  pulled!
```

// from a template:
```
$ xp pull example
  writing to local package.json file...
  writing to local global.js file...
  writing to local triggers.js file...
  writing to local variation.js file...
  writing to local variation.css file...
```

once you have scaffolded your files from an existing experience, you can always pull down the latest remote changes with ```xp pull```
```
$ xp pull // pull down latest version of experience
  pulled!
```

start building and previewing your experience:
```
$ xp variation-336711.js --watch
  xp listening on port 41337

$ xp variation-336711.js --sync
  watching for changes
  xp listening on port 41337
  synced!
```

## xp push

once your local experience is connected/configured with the correct metadata you can run ``` xp push ``` to push your changes up to the platform


## templates

xp allows you to create, publish and share experience templates

any commonjs module containing a folder called template can be used by xp to scaffold a new project

creating a template:
```
mkdir my-experience-template
cd my-experience-template
mkdir template
touch template/variation.js
npm init
npm link // make your module available globally on your system
```

using a template:
```
xp pull my-experience-template
```

tip:
in order for your folder to be a valid javascript package, you need to have a 'main' entry in your package.json that points to a a javascript file, e.g. ``` template/variation.js ``` otherwise npm will not recognise your folder as a module and you will not be able to install it

## file reference

```
files:
- package.json // metadata
- global.js // global code
- triggers.js // activation logic
- varition-xxx.js // execution code
- variation-xxx.css // css
```

## help menu

```
xp --help
Usage: xp [variation.js] [options]
       xp <cmd> [options]


Commands:

  pull           pull experience from template, remote or experience editor
  push           push experience up to remote
  open           open xp folder in finder, e.g. to locate chrome-extension
  preview-link   log sharable preview links for your variations

Options:

  -h, --help     output usage information
  -V, --version  output the version number
  -w, --watch    watch for changes and live reload
  -s, --sync     watch for changes and sync with remote
  -v, --verbose  log verbose output


Examples:

  $ xp --help
  $ xp pull
  $ xp pull 2499 1234
  $ xp pull https://app.qubit.com/p/2499/experiences/84069/editor
  $ xp pull example
  $ xp variation.js --watch
  $ xp variation.js --sync
  $ xp push
  $ xp connect
```

notes:
- if it isn't working after an update, you may need to reload the extension


[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
