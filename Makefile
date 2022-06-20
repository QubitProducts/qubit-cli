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
	-sudo security delete-certificate -c "localhost"

replicate-global-install: clear-ssl
	npm uninstall -g .
	rm -rf node_modules
	git checkout .
	git clean -fd
	npm install --ignore-scripts
	npm install -g .
