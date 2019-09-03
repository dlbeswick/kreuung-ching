CORDOVA = node_modules/.bin/cordova
TYPESCRIPT = node_modules/.bin/tsc
SASS = sass

.PHONY: clean serve build run run-emu cordova

cordova: build
	$(CORDOVA) prepare

build: www/css www/js www/css/app.css www/js/ching.js

www/js/%.js : ts/%.ts
	$(TYPESCRIPT) --noEmitOnError --outFile $@ $<

www/css/app.css : sass/app.scss
	$(SASS) $<:$@

www/js :
	mkdir -p $@

www/css :
	mkdir -p $@

run: build
	$(CORDOVA) run android --device

run-emu: build
	$(CORDOVA) run android --emulator

serve: build
	$(CORDOVA) run browser

clean:
	rm www/css/*.css
	rm www/js/*.js
	$(CORDOVA) clean
