TYPESCRIPT = node_modules/typescript/bin/tsc

.PHONY: clean serve build android android-emu

build: www/css www/js www/css/app.css www/js/ching.js

www/js/%.js : ts/%.ts
	$(TYPESCRIPT) --noEmitOnError --outFile $@ $<

www/css/app.css : sass/app.scss
	sass $<:$@

www/js :
	mkdir -p $@

www/css :
	mkdir -p $@

android: build
	cordova run android --device

android-emu: build
	cordova run android --emulator

serve: build
	cordova run browser

clean:
	-rm www/css/*.css

