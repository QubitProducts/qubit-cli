# Templates
qubit-cli allows you to create templates, so that you can easily redeploy similar experiences

## To generate a template from your local experience files:

```
qubit templatize
```

## To scaffold an experience from a template:

```
qubit pull <templateName>
```

## To make an qubit template available for sharing:

publish to npm or github. Consumers can then simply install like so:

```
using github:

npm install -g github:user/xp-tmp-example

or

npm install -g github:user/xp-multi-template-repo/example

```
