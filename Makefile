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
	rm -rf ~/Library/Application Support/fnm/node-versions/v17.5.0/installation/etc/npmrc
	npm uninstall -g qubit-cli
	sudo security delete-certificate -c "localhost"
