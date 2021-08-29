include config.mk

HOMEDIR = $(shell pwd)
rollup = ./node_modules/.bin/rollup

test:
	node tests/singleseriestests.js
	node tests/edgecasetests.js
	node tests/multiseriestests.js

deploy:
	npm version patch && make build && git commit -a -m"Build" && make pushall

pushall: sync
	git push origin master

run:
	$(rollup) -c -w

build:
	$(rollup) -c

sync:
	rsync -a $(HOMEDIR)/ $(USER)@$(SERVER):/$(APPDIR) \
    --exclude node_modules/

set-up-server-dir:
	ssh $(USER)@$(SERVER) "mkdir -p $(APPDIR)"
