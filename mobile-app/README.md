# Gundam Card Search - Mobile App

A React Native mobile application built with TypeScript and **Expo SDK 54** for searching and browsing Gundam Card Game cards.

## Features

- 🔍 Search cards by name or ID
- 🎨 Filter by card type and color
- 📱 Smooth scrolling and pagination
- 🔄 Pull-to-refresh
- 📄 Detailed card view with all information
- 🎯 Clean and intuitive UI
- 💪 Fully typed with TypeScript

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or later)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your mobile device (available on iOS App Store and Google Play Store)

## Installation

1. Navigate to the mobile-app directory:

```bash
cd mobile-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Configure API endpoint:

Edit `config.ts` and update the API URL:

```typescript
// For local development with physical device, use your computer's local IP:
export const API_BASE_URL: string = 'http://192.168.1.XXX:8000';

// For emulator/simulator on same machine:
export const API_BASE_URL: string = 'http://localhost:8000';
```

To find your local IP:

- **macOS/Linux**: Run `ifconfig | grep "inet "` or `hostname -I`
- **Windows**: Run `ipconfig` and look for IPv4 Address

## Running the App

### Start the API Server First

Make sure the backend API is running:

```bash
cd ..
python apis/main.py
```

The API should be running at `http://localhost:8000` (or your configured address).

### Start the Mobile App

1. Start Expo development server:

```bash
npm start
# or
expo start
```

2. This will open Expo DevTools in your browser at `http://localhost:19002`

3. To run on your device:

   **On Physical Device:**
   - Install "Expo Go" app from App Store (iOS) or Play Store (Android)
   - Scan the QR code shown in the terminal or browser
   - Make sure your phone and computer are on the same WiFi network

   **On iOS Simulator (macOS only):**
   - Press `i` in the terminal
   - Or click "Run on iOS simulator" in Expo DevTools

   **On Android Emulator:**
   - Press `a` in the terminal
   - Or click "Run on Android device/emulator" in Expo DevTools

## Project Structure

```
mobile-app/
├── App.tsx                     # Main app component with navigation
├── config.ts                   # API configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies
├── app.json                    # Expo configuration
├── babel.config.js             # Babel configuration
├── types/
│   └── index.ts               # TypeScript type definitions
├── screens/
│   ├── CardListScreen.tsx     # Card list with search and filters
│   └── CardDetailScreen.tsx   # Detailed card view
└── services/
    └── api.ts                 # API service functions
```

## TypeScript

This app is fully typed with TypeScript. The main type definitions are in `types/index.ts`:

- `Card` - Card data structure
- `CardListResponse` - API response for card list
- `CardStatsResponse` - API response for statistics
- `FiltersResponse` - Available filter options
- `CardSearchParams` - Search/filter parameters

To run type checking:

```bash
npm run type-check
```

## Usage

### Search for Cards

1. Enter a card name or ID in the search box
2. Tap "Search" or press enter

### Filter Cards

1. Tap "▶ Filters" to expand filter options
2. Select card type (Unit, Pilot, Command, Base)
3. Select color (Red, Blue, Green, Yellow, etc.)
4. Tap "Apply Filters" to see results
5. Tap "Clear All" to reset filters

### View Card Details

1. Tap any card from the list
2. View full card information including:
   - Card image
   - Card effects
   - Stats (AP, HP, Cost, Level)
   - Race/Trait
   - Source information

### Pagination

- Scroll to the bottom of the list to automatically load more cards
- Pull down from the top to refresh the list

## Customization

### Changing Colors

Edit the styles in `screens/CardListScreen.tsx` and `screens/CardDetailScreen.tsx`:

```typescript
const styles = StyleSheet.create({
  // Modify colors here
  searchButton: {
    backgroundColor: '#0066cc', // Change primary color
  },
  // ...
});
```

### Adjusting Pagination

In `screens/CardListScreen.tsx`, modify the initial pagination state:

```typescript
const [pagination, setPagination] = useState<PaginationState>({
  skip: 0,
  limit: 20, // Change items per page
  total: 0,
});
```

### API Timeout

In `services/api.ts`, adjust the timeout:

```typescript
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Change timeout (in milliseconds)
});
```

## Troubleshooting

### "Network Error" or "Failed to load cards"

1. **Check API is running:**

   ```bash
   curl http://localhost:8000/api/cards
   ```

2. **Verify API URL in config.js:**
   - For physical device: Use your computer's local IP (not localhost)
   - For simulator/emulator: localhost should work

3. **Check firewall:**
   - Make sure port 8000 is not blocked
   - On macOS, you may need to allow Python to accept incoming connections

### "Unable to resolve module"

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
expo start -c
```

### App crashes on startup

```bash
# Reset Expo cache
expo start -c

# Or clear npm cache
npm cache clean --force
npm install
```

### QR code won't scan

- Make sure your phone and computer are on the same WiFi network
- Try typing the URL manually in Expo Go app
- Check if your network has AP isolation enabled (some guest networks do)

## Building for Production

### Build APK (Android)

```bash
expo build:android
```

### Build IPA (iOS)

```bash
expo build:ios
```

Note: You need an Apple Developer account for iOS builds.

### Using EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure project
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## API Endpoints Used

The app communicates with the following API endpoints:

- `GET /api/cards` - Get cards with filtering and pagination
- `GET /api/cards/{card_id}` - Get specific card details
- `GET /api/filters` - Get available filter options

See the API documentation in `../apis/README.md` for more details.

## Technologies Used

- **React Native** - Mobile framework
- **TypeScript** - Type-safe JavaScript
- **Expo** - Development platform
- **React Navigation** - Navigation library
- **Axios** - HTTP client
- **FastAPI** - Backend API (in ../apis/)

## License

This project is for educational purposes.

## Support

For issues or questions:

1. Check the API is running: `http://localhost:8000/docs`
2. Check Expo documentation: https://docs.expo.dev
3. Check React Navigation docs: https://reactnavigation.org

## Next Steps

- Add user favorites/bookmarks
- Implement offline caching
- Add card comparison feature
- Add advanced filters (by stats, source, etc.)
- Implement card collection tracking
- Add dark mode support
