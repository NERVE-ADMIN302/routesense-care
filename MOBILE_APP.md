# CareMizhi Android app

CareMizhi now has a mobile-first interface and a Capacitor Android project. The APK bundles the app, fonts, illustrations and opening video; it does not depend on a development server.

## Preview

Run `npm run dev` and open http://localhost:5173/. The layout adapts to phone, tablet and desktop widths. The bottom dock contains Home, Patients, Care, Visits and Services. Tap the CareMizhi logo to return to the welcome screen.

## Build an APK on this computer

Run `npm run android:build` from the project directory. The script uses the local JDK / Android SDK / Gradle in `work/android-tools` when available, builds the frontend, syncs Android and copies the result to `releases/CareMizhi-debug.apk`.

On another computer, install JDK 21 and the Android SDK (API 36 and build tools 36.0.0), set JAVA_HOME and ANDROID_HOME, and configure android/local.properties for that computer. The Gradle wrapper downloads Gradle automatically. The build script uses a project-local Java temporary folder to avoid Windows packaged-app temporary-directory issues.

## Install

Copy `releases/CareMizhi-debug.apk` to your Android phone and open it. Android may ask you to allow installation from the app used to open the APK. This is a debug build for review; it is not a Play Store release. Minimum Android version: Android 7 / API 24, with an up-to-date Android System WebView.

## What changed

- Mobile welcome screen inspired by the supplied references, retaining the existing intro video and both custom fonts.
- Rounded blue care workspace, soft card surfaces, pastel accents, and a floating five-tab navigation dock.
- Searchable services and patient lists, patient priority filters, direct triage and care actions, and phone-friendly appointment cards.
- Android launcher icon, native back handling, light system bars, and spacing for system bars, cutouts and the keyboard.
- The previous frontend is backed up under work/mobile-app-backup.

## Current limits

The existing healthcare workflows and local demo storage are retained. Roles are workspace selectors, not authentication. Drone detections, clinical matching and hospital operational availability remain demonstrations. Online maps and external services require a network connection. The APK has separate local storage from the browser preview; existing browser records do not transfer automatically. Physical Android-device testing and a release signing key are still needed before distribution beyond a demo.
