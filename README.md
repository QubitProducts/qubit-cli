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
npm install -g qubitdigital/qubit-cli

qubit login

using npm:
npm install -gp @qubit/xp-cli

using yarn:
yarn global add @qubit/xp-cli
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


## To clone an existing experience:
```
xp clone
```

## To create a new experience:
```
xp create
```

## To push your changes up to the platform:
```
xp push
```

Before pushing changes, XP checks if there has been any change in the experience code in the Qubit platform since the last XP interaction.
This prevents you from overriding changes that would have been made by someone else directly on the platform.

In the case where changes have been made on the platform since the last use of XP, XP will show you the diff between your changes and the changes on the platform.
You can then choose to :

- override your local changes with the ones made on the platform. In this case type:
```
xp pull
```

- override the platform code with your local changes. In this case type:
```
xp push --force
```

- incorporate the changes manually (from the diff), and then force the update though the same command type:
```
xp push --force
```

## To pull remote changes from the platform:
```
xp pull
```

## To publish an experience:
```
xp publish
```

## To pause an experience:
```
xp pause
```

## To resume an experience:
```
xp resume
```

## To get the publish/pause status of an experience:
```
xp status
```

## To duplicate an experience or a variation:
```
xp duplicate
```

## To see a diff between the local file and the platform:
```
xp diff
```

## To change the traffic allocation for an experience
```
xp traffic
```
must be run inside an experience directory, `--view` to see the current setting only

## To change the goals for an experience
```
xp goals
```
with `list`, `add`, `remove` and `set-primary` being subcommands

## To open the experience overview page on app.qubit.com:
```
xp open
```
`--overview`, `--settings`, `--editor` being options

## To get and copy to clipboard relevant links (preview is default):
```
xp link
```
`--overview`, `--settings`, `--editor` and `--preview` being options

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
