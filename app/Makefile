CORDOVA = node_modules/.bin/cordova
TYPESCRIPT = node_modules/.bin/tsc
SASSC = sassc

.PHONY: clean serve build run run-emu cordova cordova-prepare browser

build: www/css/app.css www/js/ching.js www/js www/css www/js/s.js www/js/compat.js

browser: build
	"$(CORDOVA)" build browser

cordova: cordova-prepare
	"$(CORDOVA)" compile --release

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
	"$(TYPESCRIPT)"

www/css/app.css : sass/app.scss www/css
	"$(SASSC)" $< $@

run: build cordova
	"$(CORDOVA)" run android --device

run-emu: build cordova
	"$(CORDOVA)" run android --emulator

serve: build browser
	"$(CORDOVA)" run browser

clean:
	rm -rf www/css
	rm -rf www/js
	"$(CORDOVA)" clean
