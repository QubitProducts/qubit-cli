## Defining vertical and tracking_id
The options object passed to your variation is built from package.json meta, so if you need to change things like 'vertical' or 'tracking_id' you can add them to package.json meta

## Overriding visitor attributes
You can override anything returned by options.getVisitorState by editing package.json's meta.visitor field, for example you can add `visitor: { viewNumber: 2 }` and save you having to refresh the page or delete cookies while developing

![optins.meta](./pkg.gif)

## Controlling what other experiences run at the same time
By default, no other experiences will run when you use xp. However you may need to test how your experience plays with other experiences to check for conflicts.

To execute other experiences along with the one you are developing, add `"also": [otherVariationMasterId]` to the package.json meta field

## Editing goals, allocation & segments
We don't have these features yet but in the mean time you can run `xp open --settings` as a short cut, which opens the settings page for your experience in your default browser
