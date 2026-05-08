# lanime-native

React Native (Expo) port of `lanime-web`.

## Stack

- **Expo** SDK 52 (managed workflow, new architecture enabled)
- **Expo Router** v4 — file-based routing under `app/`
- **NativeWind** v4 — Tailwind CSS for React Native
- **Redux Toolkit** + **React Query** — same state stack as web
- **expo-video** — native video playback (replaces shaka-player)
- **expo-secure-store** — JWT/profile token storage (replaces cookies)
- **react-i18next** — shares JSON locale files with web (ko / en / ja)
- **react-native-toast-message** — replaces sonner
- **@expo/vector-icons** — Ionicons (replaces react-icons)

## Install

From repo root:

```bash
pnpm install
```

## Run

```bash
# Metro bundler (pick a target from the menu)
pnpm dev:lanime-native

# Direct platform launch
pnpm ios:lanime-native
pnpm android:lanime-native
```

## Environment

Set the API base URL via Expo public env:

```bash
EXPO_PUBLIC_BASE_URL=https://api.lanime.example
EXPO_PUBLIC_TIMEOUT=10000
```

(or set under `expo.extra` in `app.json`)

## Layout

```
app/                   Expo Router routes (mirrors lanime-web URLs)
  _layout.tsx          Root: providers + Stack
  (tabs)/              Bottom tabs: home / search / weekly / library
  player/[animeId]/[videoId].tsx
  auth/                mail / signup / forgot-password
  profile/             profile picker + reset-pin
  settings.tsx
  +not-found.tsx

src/
  components/          Common UI (Screen, Header, Button, Input, Thumbnail, ...)
  libs/
    apis/              Same React Query hooks as web (auth, animations, library, likes, comments, images, ad)
    i18n/              Shared locale JSONs
    style/             Theme palette
    hooks/             useTheme, useInput, typed redux hooks
    constants/         anime/weeks/tabs/routers
    tokenStorage.ts    SecureStore-backed token store (cookie replacement)
    env.ts             expo-constants / EXPO_PUBLIC_* env
  stores/              Redux slices (auth, episodeModal) — direct port from web
```

## Notes

- Business logic, types, Redux slices, and React Query hooks are direct ports — only the storage layer (cookies → SecureStore) and a few request quirks differ.
- The shared `@ensnif/common` axios factory powers the JWT interceptor on both web and native.
- For DRM/HLS-specific player needs beyond `expo-video`, swap in `react-native-video` later (interface confined to `src/components/player/VideoPlayer.tsx`).
