.PHONY: test bootstrap lint shrinkwrap

BIN = node_modules/.bin

bootstrap:
	npm install
	npm install ./deps --no-save --production

test:
	NODE_ENV=test $(BIN)/mocha --recursive
	make lint

lint:
	$(BIN)/standard

shrinkwrap:
	rm -rf node_modules
	yarn
	npm shrinkwrap
