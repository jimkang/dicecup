test:
	node tests/singleseriestests.js
	node tests/edgecasetests.js
	node tests/multiseriestests.js

prettier:
	prettier --write --single-quote "**/*.js"

