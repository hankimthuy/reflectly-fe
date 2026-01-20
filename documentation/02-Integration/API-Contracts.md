# API Contracts

## Overview

This document defines the expected API endpoints and JSON response structures for communication between the MimoSe Frontend and Backend.

**Base URL:** `https://api.mimose.app/api/v1` (production)  
**Dev URL:** `http://localhost:3001/api/v1`

---

## Authentication

### Headers
All authenticated requests require:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## Endpoints

### User & Preferences

#### `GET /user/profile`
Fetch current user profile and preferences.

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "displayName": "John Doe",
  "avatar": "https://...",
  "preferences": {
    "lastMode": "innerverse",
    "theme": "system",
    "reducedMotion": false
  },
  "createdAt": "2025-01-01T00:00:00Z"
}
```

---

### Energy & Mood (Innerverse)

#### `GET /energy-log`
Fetch energy log entries.

**Query Params:**
- `from` (ISO date) — Start date
- `to` (ISO date) — End date
- `limit` (number) — Max entries

**Response:**
```json
{
  "entries": [
    {
      "id": "uuid",
      "level": 7,
      "mood": "calm",
      "note": "Feeling rested today",
      "timestamp": "2025-01-18T09:00:00Z"
    }
  ],
  "meta": {
    "total": 30,
    "average": 6.5
  }
}
```

#### `POST /energy-log`
Create a new energy log entry.

**Request:**
```json
{
  "level": 7,
  "mood": "calm",
  "note": "Feeling rested today"
}
```

**Response:**
```json
{
  "id": "uuid",
  "level": 7,
  "mood": "calm",
  "note": "Feeling rested today",
  "timestamp": "2025-01-18T09:00:00Z"
}
```

---

### Journal

#### `GET /journal/entries`
Fetch journal entries.

**Query Params:**
- `mode` — `inner` | `outer`
- `from` (ISO date)
- `to` (ISO date)
- `limit` (number)

**Response:**
```json
{
  "entries": [
    {
      "id": "uuid",
      "mode": "inner",
      "title": "Morning Reflection",
      "content": "Today I noticed...",
      "tags": ["gratitude", "insight"],
      "createdAt": "2025-01-18T08:00:00Z",
      "updatedAt": "2025-01-18T08:30:00Z"
    }
  ]
}
```

#### `POST /journal/entries`
Create a new journal entry.

**Request:**
```json
{
  "mode": "inner",
  "title": "Morning Reflection",
  "content": "Today I noticed...",
  "tags": ["gratitude"]
}
```

---

### Social Orbit (Outerverse)

#### `GET /social-orbit`
Fetch social orbit connections.

**Response:**
```json
{
  "connections": [
    {
      "id": "uuid",
      "name": "Jane Smith",
      "avatar": "https://...",
      "distance": 2,
      "category": "family",
      "lastInteraction": "2025-01-15T00:00:00Z"
    }
  ]
}
```

#### `POST /social-orbit/move`
Adjust a connection's position in the orbit.

**Request:**
```json
{
  "connectionId": "uuid",
  "newDistance": 1,
  "reason": "Reconnected after long time"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Jane Smith",
  "distance": 1,
  "previousDistance": 2,
  "movedAt": "2025-01-18T10:00:00Z"
}
```

---

### Tasks & Goals (Outerverse)

#### `GET /tasks`
Fetch active tasks.

**Response:**
```json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "Complete project proposal",
      "description": "...",
      "priority": "high",
      "status": "in_progress",
      "dueDate": "2025-01-20T00:00:00Z"
    }
  ]
}
```

#### `GET /goals`
Fetch user goals.

**Response:**
```json
{
  "goals": [
    {
      "id": "uuid",
      "title": "Read 12 books this year",
      "progress": 2,
      "target": 12,
      "unit": "books",
      "deadline": "2025-12-31T00:00:00Z"
    }
  ]
}
```

---

## Error Responses

All errors follow this structure:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid energy level. Must be between 1 and 10.",
    "details": {
      "field": "level",
      "received": 15,
      "expected": "1-10"
    }
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing auth token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Invalid request data |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

---

## WebSocket Events (Future)

Placeholder for real-time features:

| Event | Direction | Payload |
|-------|-----------|---------|
| `energy:updated` | Server → Client | Energy log entry |
| `orbit:moved` | Server → Client | Connection position change |
| `sync:request` | Client → Server | Request data sync |

---

*API contracts are subject to change during development. Version negotiation will be implemented.*
