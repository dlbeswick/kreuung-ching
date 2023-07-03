CORDOVA = node_modules/.bin/cordova
TYPESCRIPT = node_modules/.bin/tsc
SASSC = sassc

.PHONY: clean serve build run run-emu cordova cordova-prepare browser

build: www/css/app.css www/js/ching.js www/js www/css www/js/s.js www/js/compat.js

browser: build
	"$(CORDOVA)" build browser

cordova: cordova-prepare
	"$(CORDOVA)" compile

cordova-prepare: build
	"$(CORDOVA)" prepare

www/js :
	mkdir -p $@

www/css :
	mkdir -p $@

www/js/compat.js: js/compat.js
	cp $< $@

www/js/s.js: js/s.js
	cp $< $@

www/js/ching.js: ts/*.ts ts/lib/*.ts
	"$(TYPESCRIPT)" --noEmitOnError --target es2019 --module system --outDir www/js ts/ching.ts ts/parser_test.ts

www/css/app.css : sass/app.scss www/css
	"$(SASSC)" $< $@

run: build cordova-prepare
	"$(CORDOVA)" run android --device

run-emu: build cordova-prepare
	"$(CORDOVA)" run android --emulator

serve: build browser
	"$(CORDOVA)" run browser

clean:
	rm -rf www/css
	rm -rf www/js
	"$(CORDOVA)" clean
