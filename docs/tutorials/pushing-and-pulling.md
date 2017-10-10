# Pushing and pulling

## To create a new experience:
You can create a new experience simply by calling `qubit create`.

If you have access to more than one property, you will be able to select the property you want to create the experience for. You can also pass in your propertyId.

```
qubit create

qubit create 2499

```

## To clone an existing experience:
qubit clone allows you to copy down all the files from an existing experience so that you can work on it locally.

You can clone an existing experience simply by calling `qubit clone`.

If you have access to more than one property, you will be able to select the property you want to clone the experience from, and then you will be able to search for that experience using the terminal prompt.

You could also navigate to the experience in your browser, since the qubit-cli extension will detect which experience you are working on and ask if you would like to clone that one.

Finally if you know the ids or have the url to hand, you can simply paste these in as an argument and qubit-cli will understand which experience you wish to clone.

If you know the experience
```
qubit clone

qubit clone 2499 1234

qubit clone https://app.qubit.com/p/2499/experiences/1234
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
