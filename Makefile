.PHONY: test

BIN = node_modules/.bin

test:
	$(BIN)/istanbul cover $(BIN)/_mocha -- --recursive
	$(BIN)/standard
