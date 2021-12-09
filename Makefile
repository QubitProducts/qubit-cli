.PHONY: test bootstrap lint shrinkwrap install-private-packages uninstall-private-packages create-install-private-packages 

BIN = node_modules/.bin

bootstrap:
	npm install

test: lint
	npm test

lint:
	npm run lint

