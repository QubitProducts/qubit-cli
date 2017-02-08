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


## installation

```
npm install -gp qubitdigital/xp-cli
```

## setup

```
xp extension
```
then drag the chrome-extension folder into chrome

## quick start:

```
xp pull example
xp --watch
```
Now open chrome and turn on xp by clicking on the extension icon. You should see the background of the page turn yellow!

## to pull down an existing experience:

- If you know the propertyId and experienceId:
```
xp pull <propertyId> <experienceId>
```
- If you know the url:
```
xp pull https://app.qubit.com/p/{propertyId}/experiences/{experienceId}
```
- Otherwise, type ``` xp pull ``` and navigate to your experience, xp will guide you from there

## to create a new experience in the platform:

```
xp create <propertyId>
```
note: propertyId is the number after /p/ in our urls

## to save your changes to the platform:

```
xp push
```

## to generate a template from your experience:

```
xp templatize
```

## to pull a template into a local experience:

```
xp pull <templateName>
```

## to make an xp template available worldwide:

```
git push or npm publish
```

## to install a template for use locally:

```
npm install -g xp-tmp-<templateName>
```

## :fire: hot reloading!
to use the super cool hot reloading feature, all you need to do is implement a remove function in your variation file like so:

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
