# 🔥 Hecovačka - Motivačná PWA

**Funkčná Progressive Web App pre motiváciu a accountability medzi priateľmi!**

## 🎯 Prehľad projektu

Hecovačka je motivačná accountability aplikácia, ktorá pomáha skupinám priateľov motivovať sa navzájom pri dosahovaní osobných cieľov. Aplikácia kombinuje sledovanie pokroku, skupinovú komunikáciu a motivačné "hecovačky" správy.

## ✅ **MVP JE HOTOVÉ!**

### 🚀 Implementované funkcie
- ✅ **Užívateľské účty** - registrácia a prihlásenie
- ✅ **Dashboard s pokrokom** - sledovanie denných cieľov
- ✅ **Skupinový systém** - demo skupina s členmi
- ✅ **História pokroku** - prehľad aktivít v čase
- ✅ **Hecovačky systém** - motivačné správy medzi priateľmi
- ✅ **Real-time komunikácia** - Socket.io infraštruktúra
- ✅ **PWA funkcionalita** - offline support, install prompt
- ✅ **Slovenský jazyk** - kompletná lokalizácia

### 🔮 Budúce vylepšenia
- 📊 Štatistiky a grafy
- 🏆 Achievement systém
- 🔔 Push notifikácie
- 🤖 AI motivačné správy
- 📱 Mobile app verzia

## Technický stack

### Frontend (React Native)
- React Native 0.74.0
- React Navigation 6
- Firebase Auth
- Firebase Cloud Messaging
- Socket.io Client

### Backend (Node.js)
- Express.js
- MongoDB + Mongoose
- Socket.io
- Firebase Admin SDK
- OpenAI/Anthropic API

## Inštalácia

### Požiadavky
- Node.js 18+
- React Native CLI
- Android Studio
- MongoDB (lokálne alebo cloud)

### Frontend setup
```bash
cd Hecovacka
npm install
npx react-native run-android
```

### Backend setup
```bash
cd server
npm install
npm run dev
```

## Štruktúra projektu

```
hecovacka/
├── Hecovacka/              # React Native app
│   ├── src/
│   │   ├── components/     # UI komponenty
│   │   ├── screens/        # Obrazovky
│   │   ├── navigation/     # Navigácia
│   │   ├── services/       # API služby
│   │   └── utils/          # Pomocné funkcie
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # API endpointy
│   │   ├── models/         # MongoDB modely
│   │   ├── middleware/     # Express middleware
│   │   └── services/       # Biznis logika
├── docs/                   # Dokumentácia
└── README.md
```

## Vývoj

### Spustenie vývojového prostredia
1. Spusti MongoDB server
2. Spusti backend: `cd server && npm run dev`
3. Spusti React Native: `cd Hecovacka && npx react-native start`
4. Spusti Android app: `npx react-native run-android`

### Testovanie
```bash
# Frontend testy
cd Hecovacka && npm test

# Backend testy
cd server && npm test
```

## Konfigurácia

### Environment variables
Vytvor `.env` súbory v `server/` a `Hecovacka/` adresároch:

#### server/.env
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/hecovacka
FIREBASE_PROJECT_ID=your-project-id
OPENAI_API_KEY=your-openai-key
```

#### Hecovacka/.env
```
API_BASE_URL=http://localhost:3000
FIREBASE_PROJECT_ID=your-project-id
```

## Prispievanie

1. Fork repozitár
2. Vytvor feature branch (`git checkout -b feature/nova-funkcionalita`)
3. Commit zmeny (`git commit -am 'Pridaj novú funkcionalitu'`)
4. Push do branch (`git push origin feature/nova-funkcionalita`)
5. Vytvor Pull Request

## Licencia

MIT License - pozri [LICENSE](LICENSE) súbor.

## Kontakt

Pre otázky a návrhy vytvor issue v GitHub repozitári.
