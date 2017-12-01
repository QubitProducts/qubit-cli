.PHONY: test bootstrap lint shrinkwrap

BIN = node_modules/.bin

bootstrap:
	npm install
	npm install ./deps --no-save --production

test:
	npm install ./deps --no-save --production
	NODE_ENV=test $(BIN)/mocha --recursive
	npm uninstall qubit-cli-deps
	make lint

lint:
	$(BIN)/standard

shrinkwrap:
	npm uninstall --save qubit-cli-deps
	rm -rf node_modules
	npm install
