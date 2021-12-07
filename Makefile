.PHONY: test bootstrap lint shrinkwrap install-private-packages uninstall-private-packages create-install-private-packages 

BIN = node_modules/.bin

bootstrap:
	npm install

test: lint
	npm test

lint:
	npm run lint

install-private-packages:
# 	Backup public package.json
	@cp package.json public-package.json
	@cp npm-shrinkwrap.json public-npm-shrinkwrap.json

#	Install private package.json
	@cp private-package.json package.json
	@cp private-npm-shrinkwrap.json npm-shrinkwrap.json

	npm install

# 	Install public package.json
	@cp public-package.json package.json
	@cp public-npm-shrinkwrap.json npm-shrinkwrap.json
	@rm public-package.json
	@rm public-npm-shrinkwrap.json

uninstall-private-packages:
	npm uninstall --save @qubit/buble @qubit/buble-loader @qubit/experience-defaults @qubit/jolt @qubit/poller @qubit/uv-api @qubit/http-api @qubit/placement-engine

create-install-private-packages: uninstall-private-packages
# 	Backup public package.json
	cp package.json public-package.json
	cp npm-shrinkwrap.json public-npm-shrinkwrap.json

	npm install @qubit/buble @qubit/buble-loader @qubit/experience-defaults @qubit/jolt @qubit/poller @qubit/uv-api @qubit/http-api @qubit/placement-engine

#	Backup private package.json
	cp package.json private-package.json
	cp npm-shrinkwrap.json private-npm-shrinkwrap.json

# 	Install public package.json
	cp public-package.json package.json
	cp public-npm-shrinkwrap.json npm-shrinkwrap.json
	rm public-package.json
	rm public-npm-shrinkwrap.json

update-private-packages-version:
	node bin/sync-versions
	git add private*
	git commit -m "Sync package.json versions"
