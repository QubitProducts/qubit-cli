.PHONY: test

BIN = node_modules/.bin

test:
	NODE_ENV=test $(BIN)/mocha --require async-to-gen/register --recursive
	make lint

lint:
	$(BIN)/standard
