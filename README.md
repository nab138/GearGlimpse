# GearGlimpse

This is a WIP Mobile FRC Telemetry aplication designed for iOS.

It is made in ionic/capacitor, which means an andriod port is feasable.

# Usage
If for some reason you want to use this app, you can.
## On iOS
To install the app on iOS, you have two options based on your hardware:
### Sidelaod with SideStore (Windows, Mac, or Linux)
1. Follow the instructions at https://sidestore.io/#get-started to install sidestore on your phone. You can use the discord link on the website for help if you need.
2. Once you have verified sidestore is working (try refreshing sidestore from within itself), download the latest ipa to your iphone from the "Artifacts" section of the latest [actions run](https://github.com/nab138/GearGlimpse/actions/workflows/build.yml)
3. Go to sidestore, and click the plus in the top left corner of my apps, then browse to where you downloaded the ipa and select it.
4. If all goes well, open GearGlimpse!
### Sideload with xcode (Mac only)
If you own a mac, you may find this option easier. It requires that you have installed and know how to use xcode.
1. Clone this repository and cd into it. `git clone https://github.com/nab138/GearGlimpse && cd GearGlimpse`
2. Install npm dependencies `npm install`
3. Install the ionic cli `npm install -g @ionic/cli`
4. Add ios support and build for ios `ionic capacitor add ios && ionic capacitor build ios`
5. In the folder called ios, you will find an Xcode Project you can now open and install to your iPhone.

## On Desktop
If you don't want to deal with sideloading or don't have an iphone, you can test it out on a desktop in a browser easily.

Pre-requisites: Node.js and npm
1. Clone this repository and cd into it. `git clone https://github.com/nab138/GearGlimpse && cd GearGlimpse`  (You can also use the download as zip or github desktop on windows)
2. Install npm dependencies `npm install`
3. Install the ionic cli `npm install -g @ionic/cli`
4. Launch the development server: `ionic serve`
5. A browser window will be automatically opened showing the app. If you want to simulate a phone, open devtools (Ctrl+Shift+I) and select a device at the top of the screen.
# Future Plans

I might work on it, I might not, who knows.
