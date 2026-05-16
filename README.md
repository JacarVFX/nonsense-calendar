# NONSENSE — Production Calendar

PWA de calendario de producción. React + Vite + Firebase (Firestore + Google Auth).

## Stack

- React 18 + Vite 6
- Firebase Firestore (real-time sync) + Auth (Google)
- vite-plugin-pwa (Workbox) — instalable en iOS, Android, Windows, Mac
- CSS puro, sin librerías UI

## Setup local

```bash
npm install
cp .env.example .env
# rellenar .env con las credenciales de Firebase
npm run dev
```

## Variables de entorno

Todas las claves Firebase van en `.env` con prefijo `VITE_`:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Firestore

Estructura: `users/{userId}/events/{eventId}`

Campos:
- `name`: string
- `date`: string `YYYY-MM-DD`
- `cat`: `grab` | `meet` | `ent` | `dead` | `other`
- `note`: string
- `createdAt`, `updatedAt`: timestamps

Las reglas de seguridad están en `firestore.rules` — aplícalas en Firebase Console.

## Deploy

```bash
npm run build
vercel --prod
```

Configurar las mismas variables de entorno en Vercel Dashboard.
