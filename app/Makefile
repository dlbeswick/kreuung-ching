CORDOVA = node_modules/.bin/cordova
TYPESCRIPT = node_modules/.bin/tsc
SASS = sass

.PHONY: clean serve build run run-emu cordova cordova-prepare browser data

build: www/css/app.css www/js/ching.js | www/js www/css data

data:
	test -n "$(DATAPATH)" || { echo "No data path given"; exit 1 ; }
	test -d www/data || mkdir www/data
	rsync -rt --delete "$(DATAPATH)"* www/data/

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

run: build cordova-prepare
	"$(CORDOVA)" run android --device

run-emu: build cordova-prepare
	"$(CORDOVA)" run android --emulator

serve: build cordova-prepare
	"$(CORDOVA)" run browser

clean:
	rm -rf www/css
	rm -rf www/js
	"$(CORDOVA)" clean
