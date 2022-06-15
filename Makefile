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
	npm uninstall -g qubit-cli
	sudo security delete-certificate -c "localhost"
