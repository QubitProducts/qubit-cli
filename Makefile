.PHONY: test bootstrap lint

BIN = node_modules/.bin

bootstrap:
	npm install
	npm install ./deps --no-save --production

test:
	NODE_ENV=test $(BIN)/mocha --recursive
	make lint

lint:
	$(BIN)/standard
