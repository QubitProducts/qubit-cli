.PHONY: test bootstrap lint

BIN = node_modules/.bin

bootstrap:
	npm i --dev --ignore-scripts

test: lint
	npm test

lint:
	npm run lint

clear-ssl:
	rm -rf ~/.qubit-ssl
	rm -rf ~/.qubitrc
	rm -rf ~/.npmrc
	rm -rf "`npm config get globalconfig`"
	npm uninstall -g qubit-cli
	sudo security delete-certificate -c "localhost"
