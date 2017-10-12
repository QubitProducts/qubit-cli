## :fire: Hot reloading!
The hot reloading feature allows you to preview updates to your experience without having to go through a full page refresh.

Apart from being much faster, this can be useful if your experience requires manual steps in order to get the page into a state where your experience can fire - it would be a pain to have to do that manually every time just to see your changes!

Its actually really easy to enable this feature, just implement and return a remove function in your variation file.

The remove function should undo anything your experience does. For example, if your experience added a modal to the page, the implementation would literally remove the modal element.

That way, Qubit-CLI can remove your experience before re-executing it, and you won't be left with two modals on the page.

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
