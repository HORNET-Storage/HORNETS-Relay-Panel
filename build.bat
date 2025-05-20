@echo off
REM This script sets the necessary environment variable and starts the React app

echo Setting OpenSSL legacy provider and increasing memory allocation...
set "NODE_OPTIONS=--openssl-legacy-provider --max-old-space-size=4096"

REM Run lessc directly using local node_modules
call node_modules\.bin\lessc --js --clean-css="--s1 --advanced" src/styles/themes/main.less public/themes/main.css
if errorlevel 1 goto error

echo Theme built successfully, starting the app...
call yarn run craco build
if errorlevel 1 goto error
goto end

:error
echo Failed with error #%errorlevel%.
exit /b %errorlevel%

:end