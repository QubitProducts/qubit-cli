.PHONY: test

BIN = node_modules/.bin

test:
	npm install ./deps --no-save --production
	NODE_ENV=test $(BIN)/mocha --recursive
	make lint

lint:
	$(BIN)/standard
