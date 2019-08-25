.PHONY : clean serve build android android-emu

www/css/app.css : sass/minima.scss
	sass $<:$@

build: www/css/app.css

android: build
	cordova run android --device

android-emu: build
	cordova run android --emulator

serve: build
	cordova run browser

clean:
	-rm www/css/*.css

