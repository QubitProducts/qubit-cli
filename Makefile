.PHONY: test

BIN = node_modules/.bin

test:
	NODE_ENV=test $(BIN)/mocha --recursive
	make lint

lint:
	$(BIN)/standard
