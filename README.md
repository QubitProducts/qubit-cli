# ![extension icon](./chrome-extension/icons/on48.png)
## QUBIT-CLI

A client to facilitate local development of experiences for the qubit platform

## Features

fast previewing
- built in experience server for fastest possible previewing on any website
- enable live hot reloading with a little bit of code

local tools
- use your local editor/IDE of choice to write experience code
- use your own workflow and versioning tools
- write and run local unit tests

interact with the platform from the command line
- create new experiences or clone existing ones
- push remote changes to the platform
- pull remote changes from the platform
- publish | pause | resume your experience

templates
- speed up local development
- share ideas and examples

## Installation

```
using npm:
npm install -g qubit-cli

using yarn:
yarn global add qubit-cli

qubit login
```

## Setup

```
qubit extension
```
then drag the chrome-extension folder into the chrome extensions pane

## Previewing with local server:

```
qubit pull example
qubit
```
Now open chrome and turn on qubit by clicking on the extension icon ![extension icon](./chrome-extension/icons/off16.png). You should see the background of the page turn yellow! Change the css in varaition.css, and the preview should update on the fly!


## To clone an existing experience:
```
qubit clone
```

## To create a new experience:
```
qubit create
```

## To pull down remote changes:
```
qubit pull
```

## To push your changes up to the platform:
```
qubit push
```

qubit-cli warns you if there have been any remote changes so that you have the opportunity to `qubit pull` them down. Alternatively you can `qubit push --force`

## To publish an experience:
```
qubit publish
```

## To pause an experience:
```
qubit pause
```

## To resume an experience:
```
qubit resume
```

## To get the publish/pause status of an experience:
```
qubit status
```

## To duplicate an experience or a variation:
```
qubit duplicate
```

## To see a diff between the local file and the platform:
```
qubit diff
```

## To change the traffic allocation for an experience
```
qubit traffic
```
must be run inside an experience directory, `--view` to see the current setting only

## To change the goals for an experience
```
qubit goals
```
with `list`, `add`, `remove` and `set-primary` being subcommands

## To open the experience overview page on app.qubit.com:
```
qubit open
```
`--overview`, `--settings`, `--editor` being options

## To get and copy to clipboard relevant links (preview is default):
```
qubit link
```
`--overview`, `--settings`, `--editor` and `--preview` being options

## To generate a template from your local experience files:

```
qubit templatize
```

## To scaffold an experience from a template:

```
qubit pull <templateName>
```

## To make an qubit template available for sharing:

publish to npm or git. Consumers can then simply install like so:

```
using npm:
npm install -g xp-tmp-example
npm install -g github:user/xp-tmp-example
npm install -g github:user/xp-multi-template-repo/example

using yarn:
yarn global add xp-tmp-example
yarn global add github:user/xp-tmp-example
yarn global add github:user/xp-multi-template-repo/example
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

## More info

- [fyi](./docs/FYI.md)

## Changelog

- [changelog](./docs/CHANGELOG.md)

notes:
- if it isn't working after an update, you may need to reload the extension


[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
