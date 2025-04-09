#!/bin/bash

# Set OpenSSL configuration for Node.js >= 17
export NODE_OPTIONS="--openssl-legacy-provider"

# Start the app
yarn start
