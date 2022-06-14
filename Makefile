.PHONY: test bootstrap lint

BIN = node_modules/.bin

bootstrap:
	npm install

test: lint
	npm test

lint:
	npm run lint
