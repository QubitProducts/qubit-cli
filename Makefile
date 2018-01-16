.PHONY: test bootstrap lint shrinkwrap

BIN = node_modules/.bin

bootstrap:
	npm install
	npm install ./deps --no-save --production

test:
	node test/setup && NODE_ENV=test $(BIN)/mocha --recursive
	make lint

lint:
	$(BIN)/standard

shrinkwrap:
	npm uninstall --save qubit-cli-deps
	rm -rf node_modules
	npm install
