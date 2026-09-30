# Gestor de Postulaciones Laborales

Aplicación web para registrar, filtrar y ordenar postulaciones de empleo.

## Stack

- **Frontend:** Next.js (App Router, React, CSS nativo)
- **Backend:** Python + FastAPI + Pydantic v2 + SQLAlchemy
- **Base de datos:** PostgreSQL 16
- **Infraestructura:** Docker Compose

## Puertos

| Servicio | Puerto |
|----------|--------|
| Frontend | 3000 |
| Backend | 8000 |
| PostgreSQL | solo red interna |

## Despliegue

```bash
docker compose up --build
```

La aplicación estará disponible en `http://localhost:3000`.

## Estructura

```
.
├── backend/          # API FastAPI
├── frontend/         # Aplicación Next.js
├── docker-compose.yml
└── .env              # Credenciales (no subir a git)
```
