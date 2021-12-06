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
	@cp package-lock.json public-package-lock.json

#	Install private package.json
	@cp private-package.json package.json
	@cp private-package-lock.json package-lock.json

	npm install

# 	Install public package.json
	@cp public-package.json package.json
	@cp public-package-lock.json package-lock.json
	@rm public-package.json
	@rm public-package-lock.json

uninstall-private-packages:
	npm uninstall --save @qubit/buble @qubit/buble-loader @qubit/experience-defaults @qubit/jolt @qubit/poller @qubit/uv-api @qubit/http-api @qubit/placement-engine

create-install-private-packages: uninstall-private-packages
# 	Backup public package.json
	cp package.json public-package.json
	cp package-lock.json public-package-lock.json

	npm install @qubit/buble @qubit/buble-loader @qubit/experience-defaults @qubit/jolt @qubit/poller @qubit/uv-api @qubit/http-api @qubit/placement-engine

#	Backup private package.json
	cp package.json private-package.json
	cp package-lock.json private-package-lock.json

# 	Install public package.json
	cp public-package.json package.json
	cp public-package-lock.json package-lock.json
	rm public-package.json
	rm public-package-lock.json

update-private-packages-version:
	node bin/sync-versions
	git add private*
	git commit -m "Sync package.json versions"
