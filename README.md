# เครื่องฉิ่ง

This is a program to help practice and perform Thai music. It runs on both Android and in web browsers via Cordova.

# Build Requirements

* nodejs (tested with v18.16.1)
* npm (tested with 9.5.1)
* GNU Make
* Android SDK Build Tools 33.0.2

# Building

1. Download the Android SDK commandline tools. Make sure the contents of the SDK are installed in a path like `android/cmdline-tools/latest` as the SDK will complain if this isn't followed. Alternatively, you might like to install Android Studio.
1. Run `export ANDROID_HOME=<path>` where 'path' is the root of the location that you installed the commandline tools. For example, if the commandline tools were installed to `/opt/android-sdk/cmdline-tools/latest`, then run `export ANDROID_HOME=/opt/android-sdk`.
1. Install the required SDK by running `$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "build-tools;33.0.2"`
1. Run `npm install` to install dependencies.
1. Change to the `app` folder and Run `make cordova`.

# Development

You can use the Make task `run-emu` to run the project in an Android emulator for testing. Here's my commandline:

  export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64/; \
  export ANDROID_HOME=<your android sdk path>; \
  export PATH=/usr/lib/jvm/java-11-openjdk-amd64/bin/:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/emulator:$PATH ; \
  make run-emu

Please note that you may need to use Android Studio or the `avdmanager` command to create an emulator, first.

You can also use the Make task `run serve` to open the Cordova browser project in a local webbrowser.
