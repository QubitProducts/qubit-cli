.PHONY: test bootstrap lint shrinkwrap

BIN = node_modules/.bin

bootstrap:
	npm install
	npm install ./deps --no-save

test: lint
	npm test

lint:
	npm run lint

shrinkwrap:
	npm uninstall --save qubit-cli-deps
	rm -rf node_modules
	npm install
