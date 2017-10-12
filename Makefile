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
	yarn remove qubt-cli-deps
	rm -rf node_modules
	yarn
	npm shrinkwrap
