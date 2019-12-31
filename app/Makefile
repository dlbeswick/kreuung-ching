CORDOVA = node_modules/.bin/cordova
TYPESCRIPT = node_modules/.bin/tsc
SASS = sass

.PHONY: clean serve build run run-emu cordova cordova-prepare browser data

build: www/css/app.css www/js/ching.js data | www/js www/css

data:
	test -n "$(DATAPATH)" || { echo "No data path given"; exit 1 ; }
	test -d www/data || mkdir www/data
	cp -v "$(DATAPATH)"* www/data/

browser: cordova-prepare
	"$(CORDOVA)" build browser

cordova: cordova-prepare
	"$(CORDOVA)" compile

cordova-prepare: build
	"$(CORDOVA)" prepare

www/js :
	mkdir -p $@

www/css :
	mkdir -p $@

www/js/ching.js : ts/ching.ts ts/messages.ts ts/instrument.ts ts/glongset.ts ts/shaper.ts
	"$(TYPESCRIPT)" --noEmitOnError --alwaysStrict --outFile $@ $<

www/css/app.css : sass/app.scss
	"$(SASS)" $<:$@

run: build
	"$(CORDOVA)" run android --device

run-emu: build
	"$(CORDOVA)" run android --emulator

serve: build
	"$(CORDOVA)" run browser

clean:
	rm -rf www/css
	rm -rf www/js
	"$(CORDOVA)" clean
