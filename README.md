# Gestor de Postulaciones Laborales

Aplicación web para registrar, filtrar, ordenar y analizar postulaciones de empleo. Permite exportar e importar datos en formato JSON para respaldo y restauración.

## Características

- **Registro y edición** de postulaciones con validación de campos
- **Búsqueda global** en tiempo real por empresa, puesto o tecnologías
- **Filtros combinables** por estado, canal, modalidad y prioridad
- **Ordenación** por columnas (fecha, empresa, puesto, salario)
- **Panel de estadísticas** con métricas globales y desgloses
- **Exportar/Importar JSON** para respaldo y migración de datos
- **Vista responsiva** con soporte para dispositivos móviles

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14 (App Router), React, TypeScript, CSS nativo |
| Backend | Python 3.12, FastAPI, Pydantic v2, SQLAlchemy 2.0 |
| Base de datos | PostgreSQL 16 |
| Infraestructura | Docker, Docker Compose |

## Puertos

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Frontend | 3000 | Interfaz web (accesible desde el navegador) |
| Backend | 8000 | API REST (documentación en `/docs`) |
| PostgreSQL | — | Solo red interna Docker, sin exponer al host |

## Despliegue Rápido

### Prerrequisitos

- Docker 24+
- Docker Compose v2+

### Inicio

```bash
# Clonar el repositorio
git clone git@github.com:migue-maca/job-tracker-app.git
cd job-tracker-app

# Configurar credenciales (editar si es necesario)
cp .env.example .env

# Levantar todos los servicios
docker compose up --build
```

La aplicación estará disponible en `http://localhost:3000`.

### Comandos Útiles

```bash
# Ver logs en tiempo real
docker compose logs -f

# Reconstruir un servicio específico
docker compose up --build backend
docker compose up --build frontend

# Detener y eliminar contenedores + volúmenes
docker compose down -v

# Acceder al shell del backend
docker compose exec backend bash
```

## Estructura del Proyecto

```
.
├── backend/                    # API FastAPI
│   ├── app/
│   │   ├── main.py            # Punto de entrada
│   │   ├── config.py          # Configuración por variables de entorno
│   │   ├── database.py        # Engine y sesión SQLAlchemy
│   │   ├── dependencies.py    # Inyección de dependencias
│   │   ├── models/            # Modelos ORM
│   │   ├── schemas/           # Esquemas Pydantic v2
│   │   ├── repositories/      # Capa de acceso a datos
│   │   ├── services/          # Lógica de negocio
│   │   └── routers/           # Endpoints REST
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                  # Aplicación Next.js
│   ├── src/
│   │   ├── app/               # App Router (layout, página principal)
│   │   ├── components/ui/     # Componentes de interfaz
│   │   ├── features/          # Lógica de dominio
│   │   └── styles/            # CSS nativo
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── docker-compose.yml         # Orquestación de servicios
├── .env                       # Credenciales (git-ignored)
├── .env.example               # Plantilla de credenciales
└── .gitignore
```

## API REST

La API está documentada automáticamente por FastAPI en `http://localhost:8000/docs`.

### Endpoints Principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/postulaciones` | Listar con filtros y ordenación |
| POST | `/api/postulaciones` | Crear nueva postulación |
| GET | `/api/postulaciones/{id}` | Obtener por ID |
| PUT | `/api/postulaciones/{id}` | Actualizar existente |
| DELETE | `/api/postulaciones/{id}` | Eliminar |
| GET | `/api/postulaciones/exportar` | Exportar todo como JSON |
| POST | `/api/postulaciones/importar?modo=añadir` | Importar JSON |
| GET | `/api/estadisticas` | Métricas globales |
| GET | `/health` | Verificación de salud |

## Exportar e Importar

### Exportar

El botón **Exportar** descarga un fichero `postulaciones-DD-MM-YYYY.json` con todas las postulaciones registradas.

### Importar

El botón **Importar** permite cargar un fichero JSON con dos modos:

- **Añadir a existentes**: Solo crea las no duplicadas (detecta duplicados por empresa + puesto + fecha)
- **Reemplazar todo**: Elimina todas las existentes y carga las del fichero

El JSON debe ser un array de objetos con la estructura:

```json
[
  {
    "fecha_postulacion": "2026-10-15",
    "empresa": "Empresa Ejemplo",
    "puesto": "Desarrollador Full-Stack",
    "canal_origen": "LinkedIn",
    "modalidad": "Remoto",
    "ubicacion": "Madrid",
    "salario_min": 25000,
    "salario_max": 35000,
    "estado": "Enviada",
    "prioridad": "Alta",
    "tipo_jornada": "Completa"
  }
]
```

## Variables de Entorno

| Variable | Valor por defecto | Descripción |
|----------|-------------------|-------------|
| `DB_USER` | `jobtracker` | Usuario de PostgreSQL |
| `DB_PASSWORD` | `cambiar_en_producción` | Contraseña de PostgreSQL |
| `DB_NAME` | `jobtracker` | Nombre de la base de datos |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | URL del backend (frontend) |

## Arquitectura

El backend sigue una **separación estricta en capas**:

```
Router → Service → Repository → Model
```

- **Routers**: Definen endpoints y validan entrada
- **Services**: Lógica de negocio y reglas de dominio
- **Repositories**: Acceso a datos (queries SQLAlchemy)
- **Models**: Mapeo ORM de las tablas

El frontend usa **modularidad por features**:

```
app/          → Rutas y layouts
components/ui/ → Componentes reutilizables
features/     → Lógica de dominio, API client, hooks
styles/       → CSS nativo modular
```
