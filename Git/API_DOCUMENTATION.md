# Hecovačka API Documentation

## Overview
Hecovačka REST API poskytuje kompletné backend služby pre motivačnú accountability aplikáciu. API je postavené na Node.js + Express s MongoDB databázou a Socket.io pre real-time komunikáciu.

## Base URL
```
http://localhost:3000/api
```

## Authentication
API používa JWT (JSON Web Token) autentifikáciu. Token sa posiela v Authorization header:
```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### Authentication (`/api/auth`)

#### POST `/auth/register`
Registrácia nového používateľa
```json
{
  "name": "Janko Hraško",
  "email": "janko@example.com",
  "password": "heslo123"
}
```

#### POST `/auth/login`
Prihlásenie používateľa
```json
{
  "email": "janko@example.com",
  "password": "heslo123"
}
```

#### POST `/auth/logout`
Odhlásenie používateľa (vyžaduje autentifikáciu)

#### GET `/auth/me`
Získanie profilu aktuálneho používateľa (vyžaduje autentifikáciu)

#### PUT `/auth/profile`
Aktualizácia profilu používateľa (vyžaduje autentifikáciu)

### Groups (`/api/groups`)

#### POST `/groups`
Vytvorenie novej skupiny
```json
{
  "name": "Naša crew",
  "description": "Motivačná skupina kamarátov"
}
```

#### POST `/groups/join`
Pripojenie do skupiny pomocou kódu
```json
{
  "groupCode": "ABC123"
}
```

#### GET `/groups`
Získanie skupín používateľa

#### GET `/groups/:groupId`
Detail konkrétnej skupiny

#### DELETE `/groups/:groupId/leave`
Opustenie skupiny

#### GET `/groups/:groupId/stats`
Štatistiky skupiny

### Goals (`/api/goals`)

#### POST `/goals`
Vytvorenie nového cieľa
```json
{
  "activity": "kliky",
  "targetAmount": 100,
  "unit": "krát",
  "frequency": "denne",
  "groupId": "group_id_here",
  "description": "Denné kliky pre kondíciu",
  "dailyDeadline": "22:00"
}
```

#### GET `/goals`
Získanie cieľov používateľa
- Query params: `groupId`, `active`

#### GET `/goals/:goalId`
Detail konkrétneho cieľa s históriou pokroku

#### PUT `/goals/:goalId`
Aktualizácia cieľa

#### DELETE `/goals/:goalId`
Deaktivácia cieľa

#### GET `/goals/group/:groupId`
Všetky ciele v skupine

#### POST `/goals/:goalId/complete`
Označenie cieľa ako splneného

### Progress (`/api/progress`)

#### POST `/progress`
Aktualizácia pokroku
```json
{
  "goalId": "goal_id_here",
  "currentAmount": 60,
  "comment": "Dnes som dal 60 klikov!"
}
```

#### GET `/progress/today`
Dnešný pokrok používateľa
- Query params: `groupId`

#### GET `/progress/goal/:goalId`
História pokroku pre konkrétny cieľ
- Query params: `days` (default: 30)

#### GET `/progress/group/:groupId`
Dnešný pokrok všetkých členov skupiny

#### GET `/progress/stats/weekly`
Týždenné štatistiky používateľa

#### GET `/progress/streak/:goalId`
Aktuálna séria pre cieľ

### Hecovačky (`/api/hecovacky`)

#### POST `/hecovacky/send`
Poslanie hecovačky
```json
{
  "targetUserId": "user_id_here",
  "groupId": "group_id_here",
  "message": "Poď na to, šampión!",
  "type": "motivačné"
}
```

#### GET `/hecovacky/templates`
Šablóny hecovačiek
- Query params: `type` (vtipné, motivačné, prísne)

#### GET `/hecovacky/received`
Prijaté hecovačky
- Query params: `days`, `groupId`

#### GET `/hecovacky/sent`
Odoslané hecovačky
- Query params: `days`, `groupId`

#### GET `/hecovacky/group/:groupId`
Všetky hecovačky v skupine
- Query params: `days`

#### POST `/hecovacky/ai-suggest`
AI návrhy hecovačiek (zatiaľ template-based)

## Response Format

Všetky API odpovede majú konzistentný formát:

### Success Response
```json
{
  "success": true,
  "message": "Operácia úspešná!",
  "data": {
    // response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Chybová správa",
  "errors": [
    // validation errors (optional)
  ]
}
```

## Status Codes

- `200` - OK (úspešná operácia)
- `201` - Created (úspešne vytvorené)
- `400` - Bad Request (chybný request)
- `401` - Unauthorized (chýba/neplatný token)
- `403` - Forbidden (nemáš oprávnenie)
- `404` - Not Found (nenájdené)
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error (chyba servera)

## Real-time Events (Socket.io)

### Client Events (posielané z klienta)
- `join_group` - pripojenie do skupinovej miestnosti
- `leave_group` - opustenie skupinovej miestnosti

### Server Events (posielané na klienta)
- `progressUpdate` - aktualizácia pokroku člena skupiny
- `hecovackaReceived` - prijatá hecovačka
- `hecovackaSent` - hecovačka odoslaná v skupine
- `goalCompleted` - člen skupiny splnil cieľ
- `memberJoined` - nový člen v skupine
- `memberLeft` - člen opustil skupinu

## Rate Limiting

- Authentication endpoints: 5 requests per 15 minutes per IP
- General API: 100 requests per 15 minutes per user
- Hecovačky sending: 20 requests per hour per user

## Data Models

### User
```json
{
  "_id": "user_id",
  "name": "Janko Hraško",
  "email": "janko@example.com",
  "avatar": "avatar_url",
  "groups": [
    {
      "groupId": "group_id",
      "role": "member",
      "joinedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "stats": {
    "totalGoals": 5,
    "completedGoals": 3,
    "currentStreak": 7,
    "longestStreak": 15
  },
  "preferences": {
    "notifications": {
      "hecovacky": true,
      "progress": true,
      "reminders": true
    },
    "hecovackaDeadline": "22:00"
  }
}
```

### Group
```json
{
  "_id": "group_id",
  "name": "Naša crew",
  "description": "Motivačná skupina",
  "groupCode": "ABC123",
  "members": [
    {
      "userId": "user_id",
      "role": "admin",
      "joinedAt": "2024-01-01T00:00:00.000Z",
      "isActive": true
    }
  ],
  "stats": {
    "totalMembers": 3,
    "totalGoals": 15,
    "completedToday": 8
  }
}
```

### Goal
```json
{
  "_id": "goal_id",
  "userId": "user_id",
  "groupId": "group_id",
  "activity": "kliky",
  "targetAmount": 100,
  "unit": "krát",
  "frequency": "denne",
  "description": "Denné kliky",
  "dailyDeadline": "22:00",
  "isActive": true,
  "stats": {
    "totalDays": 30,
    "completedDays": 25,
    "currentStreak": 5,
    "bestStreak": 12
  }
}
```

### Progress
```json
{
  "_id": "progress_id",
  "userId": "user_id",
  "goalId": "goal_id",
  "groupId": "group_id",
  "currentAmount": 60,
  "targetAmount": 100,
  "percentage": 60,
  "isCompleted": false,
  "date": "2024-01-01T00:00:00.000Z",
  "comment": "Dnes som dal 60 klikov!",
  "hecovackyReceived": [
    {
      "fromUserId": "user_id",
      "message": "Poď na to!",
      "type": "motivačné",
      "sentAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

## Environment Variables

```bash
# Server
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/hecovacka

# JWT
JWT_SECRET=your-secret-key

# Firebase (optional)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# OpenAI (optional)
OPENAI_API_KEY=

# Email (optional)
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=

# Push Notifications (optional)
FCM_SERVER_KEY=
```

## Testing

### Health Check
```bash
GET http://localhost:3000/health
```

### API Info
```bash
GET http://localhost:3000/api
```

## Error Handling

API implementuje konzistentné error handling:

1. **Validation Errors** - 400 status s detailnými chybami
2. **Authentication Errors** - 401 status
3. **Authorization Errors** - 403 status
4. **Not Found Errors** - 404 status
5. **Rate Limit Errors** - 429 status
6. **Server Errors** - 500 status s generickou správou

## Security Features

- JWT token authentication
- Password hashing (bcrypt)
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- SQL injection protection (Mongoose)
- XSS protection
