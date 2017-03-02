# ![extension icon](./chrome-extension/icons/on48.png) ![xp-cli](https://cloud.githubusercontent.com/assets/640611/18666410/a11b3394-7f23-11e6-99b5-5cbbca6da27f.png)

A client to facilitate local development of experiences for the qubit platform

## Features

local offline development
- build experiences locally in your editor/IDE of choice
- use your own workflow and versioning tools
- write and run local unit tests

advanced previewing
- instant local previewing on any site
- live hot reloading of your variation and css
- bypass qubit's remote build queue

remote syncing
- create new experiences with a single command
- scaffold your local project from existing experiences in the platform
- control when to push your changes up or pull down the latest remote changes
- develop your experience locally and choose when to share it
- use sync mode to watch for changes and sync with remote automatically

templates
- create templates to speed up local development
- publish templates to share ideas and examples with teammates
- save time and effort by automating boilerplate and common variation code
- improve code consistency and design by leveraging template reuse


## Installation

```
npm install -gp @qubit/xp-cli
```

## Setup

```
xp extension
```
then drag the chrome-extension folder into the chrome extensions pane

## Previewing with local server:

```
xp pull example
xp --watch
```
Now open chrome and turn on xp by clicking on the extension icon ![extension icon](./chrome-extension/icons/off16.png). You should see the background of the page turn yellow! Change the css in varaition.css, and the preview should update on the fly!


## To clone an existing experience
- If you know the propertyId and experienceId:
```
xp clone <propertyId> <experienceId>
```
- If you know the url:
```
xp clone https://app.qubit.com/p/{propertyId}/experiences/{experienceId}
```
- Otherwise, type ``` xp clone ``` and navigate to your experience, xp will guide you from there

## To create a new experience:

```
xp create <propertyId>
```
note: propertyId is the number after /p/ in our urls


## To push your changes up to the platform:

```
xp push
```

## To pull remote changes from the platform:
```
xp pull
```

## To see a diff between the local file and the platform:
```
xp diff
```

## To open experience overview on app.qubit.com:
```
xp open
```
`--preview`, `--settings`, `--editor` being options

## To get and copy to clipboard relevant links (option required): 
```
xp link
```
`--app` and `--preview` being options

## To generate, prefill, and copy to clipboard the QA template:
```
xp qa
```

## To generate a template from your local experience files:

```
xp templatize
```

## To scaffold an experience from a template:

```
xp pull <templateName>
```

## To make an xp template available for sharing:

publish to npm or git. Consumers can then simply install like so:

```
npm install -g xp-tmp-example
npm install -g github:user/xp-tmp-example
npm install -g github:user/xp-multi-template-repo/example
```

## :fire: Hot reloading!
Implement a remove function in your variation file like so:

```js
function execution (options) {
  console.log('executing variation')
  return {
    remove: function remove () {
      // undo any changes e.g. $modal.remove()
    }
  }
}
```

notes:
- if it isn't working after an update, you may need to reload the extension


[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
