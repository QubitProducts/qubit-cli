.PHONY: test bootstrap lint

BIN = node_modules/.bin

bootstrap:
	npm install

test: lint
	npm test

lint:
	npm run lint

release-minor: test
	npm version minor
	npm publish
	git push origin master --tags

release-major: test
	npm version major
	npm publish
	git push origin master --tags
