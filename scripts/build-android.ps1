$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $projectRoot
$bundledJdk = Join-Path $projectRoot 'work/android-tools/jdk'
if (-not $env:JAVA_HOME -and (Test-Path $bundledJdk)) { $env:JAVA_HOME = (Get-ChildItem $bundledJdk -Directory | Select-Object -First 1).FullName }
if (-not $env:ANDROID_HOME -and (Test-Path 'work/android-tools/sdk')) { $env:ANDROID_HOME = Join-Path $projectRoot 'work/android-tools/sdk' }
New-Item -ItemType Directory -Force 'work/java-temp' | Out-Null
$env:TEMP = Join-Path $projectRoot 'work/java-temp'
$env:TMP = $env:TEMP
$localGradle = Join-Path $projectRoot 'work/android-tools/gradle/gradle-8.14.3/bin/gradle.bat'
& npm.cmd run build
if ($LASTEXITCODE -ne 0) { throw 'Frontend build failed' }
& npx.cmd cap sync android
if ($LASTEXITCODE -ne 0) { throw 'Android sync failed' }
Push-Location android
try { if (Test-Path $localGradle) { & $localGradle assembleDebug --no-daemon --max-workers=2 } else { & .\gradlew.bat assembleDebug --no-daemon --max-workers=2 }; if ($LASTEXITCODE -ne 0) { throw 'Android build failed' } } finally { Pop-Location }
New-Item -ItemType Directory -Force releases | Out-Null
Copy-Item android/app/build/outputs/apk/debug/app-debug.apk releases/CareMizhi-debug.apk -Force
Write-Output 'APK ready: releases/CareMizhi-debug.apk'

