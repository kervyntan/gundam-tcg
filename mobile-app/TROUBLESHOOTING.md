# Workaround for "Too Many Files Open" Error

If you encounter "too many files open" errors with Expo/React Native, try these solutions:

## Quick Fix (Recommended)

### Option 1: Use Expo Tunnel

Instead of trying to watch all files, use Expo's tunnel mode which is more reliable:

\`\`\`bash
cd mobile-app
npx expo start --tunnel
\`\`\`

This uses Expo's cloud service to tunnel the connection, avoiding local network issues.

### Option 2: Use Web Version for Development

\`\`\`bash
cd mobile-app
npx expo start --web
\`\`\`

This will run the app in your browser for quick development and testing.

### Option 3: Increase File Limit (macOS)

\`\`\`bash

# Check current limit

ulimit -n

# Temporarily increase for this terminal session

ulimit -n 65536

# Then run npm start

npm start
\`\`\`

### Option 4: Clear Metro Bundler Cache

\`\`\`bash
cd mobile-app
npx expo start --clear
\`\`\`

### Option 5: Use .watchmanconfig

Create a `.watchmanconfig` file in the mobile-app directory (Expo will use a simpler file watcher):

\`\`\`json
{}
\`\`\`

Then run:
\`\`\`bash
npm start
\`\`\`

## Install Watchman Later (Optional)

Watchman is helpful but not required. If you want to install it later when you have more time:

\`\`\`bash

# This takes 20-30 minutes to compile

brew install watchman
\`\`\`

## Test the Mobile App

### For Quick Testing (Recommended):

\`\`\`bash
cd mobile-app
npx expo start --web
\`\`\`

Then open http://localhost:19006 in your browser.

### For Physical Device:

\`\`\`bash
cd mobile-app
npx expo start --tunnel
\`\`\`

Then scan the QR code with Expo Go app.

### For Simulator (if you have Xcode):

\`\`\`bash
cd mobile-app
npm start

# Press 'i' for iOS simulator

# Press 'a' for Android emulator

\`\`\`
