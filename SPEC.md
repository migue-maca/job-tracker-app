# SPEC.md: Gestor Profesional de Postulaciones Laborales

## 1. Objetivo y Alcance
Aplicación web orientada al seguimiento, auditoría y análisis de postulaciones de empleo. Permite registrar candidaturas con métricas detalladas, realizar búsquedas contextuales en tiempo real, filtrar según múltiples dimensiones operativas y ordenar los registros para optimizar la toma de decisiones en procesos de selección.

## 2. Arquitectura y Stack Tecnológico
- **Frontend:**
  - Framework: Next.js (App Router, React).
  - Estilos: CSS nativo modularizado en ficheros `.css` independientes (sin frameworks utilitarios como Tailwind ni preprocesadores).
- **Backend:**
  - Framework: Python con FastAPI.
  - Validación y serialización: Pydantic v2.
  - ORM / Conexión a BD: SQLAlchemy o SQLModel con driver `asyncpg` / `psycopg`.
- **Base de Datos y Persistencia:**
  - PostgreSQL (relacional).
- **Infraestructura y Entorno:**
  - Docker y Docker Compose para orquestar tres servicios desacoplados: `frontend`, `backend` y `database` (PostgreSQL).
  - Configuración mediante variables de entorno en fichero `.env`.

### Patrones Arquitectónicos
- Backend: Arquitectura en capas estricta (Routers -> Services -> Repositories -> Models/Schemas). Prohibido ejecutar consultas de base de datos directamente en los controladores/endpoints.
- Frontend: Organización modular orientada a features (enrutamiento en `app/`, lógica y componentes de dominio en `features/`, componentes genéricos en `components/ui/`).

## 3. Modelo de Datos (Entidad: Postulacion)

| Campo | Tipo | Restricción / Formato | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | UUID / Int | Primary Key, Autoincremental o generado | Identificador único |
| `fecha_postulacion` | Date | Obligatorio (`YYYY-MM-DD`, fecha local) | Fecha de registro del envío |
| `empresa` | String | Obligatorio, indexado | Nombre de la compañía |
| `puesto` | String | Obligatorio, indexado | Título del rol o vacante |
| `canal_origen` | String | Obligatorio | Portal (e.g., InfoJobs, LinkedIn, Web directa) |
| `modalidad` | Enum | Obligatorio: `Remoto`, `Presencial`, `Hibrido` | Formato de trabajo |
| `ubicacion` | String | Obligatorio (e.g., "Granada", "Madrid", "España") | Ciudad, región o país |
| `salario_min` | Numeric / Int | Opcional (nullable) | Límite inferior del rango salarial (€/año) |
| `salario_max` | Numeric / Int | Opcional (nullable) | Límite superior del rango salarial (€/año) |
| `salario_texto` | String | Opcional (nullable) | Descripción textual libre si no hay cifras exactas |
| `estado` | Enum | Obligatorio: `Enviada`, `En revision`, `En entrevista`, `Rechazado`, `Descartada`, `Oferta recibida` | Fase actual en el embudo |
| `prioridad` | Enum | Obligatorio: `Baja`, `Media`, `Alta` | Nivel de interés personal |
| `enlace_oferta` | String (URL) | Opcional (nullable) | Enlace directo a la oferta original |
| `tecnologias` | Array[String] / Text | Opcional | Stack requerido (e.g., Python, FastAPI, Docker) |
| `notas_seguimiento` | Text | Opcional (nullable) | Comentarios, contexto y notas internas |
| `info_entrevistas` | Text / JSONB | Opcional (nullable) | Fechas de fases, preguntas técnicas, feedback |

## 4. Requisitos Funcionales

### 4.1. Registro y Edición
- Formulario de alta con validación de campos obligatorios (`empresa`, `puesto`, `fecha_postulacion`, `canal_origen`, `modalidad`, `ubicacion`, `estado`, `prioridad`).
- Edición rápida de estado y notas directamente desde la vista principal o modal dedicado.

### 4.2. Búsqueda y Filtrado
- **Caja de búsqueda global:** Filtrado instantáneo por coincidencia de subcadena en `empresa`, `puesto` y `tecnologias`.
- **Filtros combinables:**
  - Filtro por Estado (multiselección o selector único).
  - Filtro por Canal / Portal de origen.
  - Filtro por Modalidad (`Remoto`, `Presencial`, `Hibrido`).
  - Filtro por Salario (rango numérico o presencia de compensación informada).
  - Filtro por Prioridad (`Baja`, `Media`, `Alta`).

### 4.3. Ordenación y Visualización
- **Vista interactiva:** Tabla interactiva responsiva estructurada con CSS nativo.
- **Criterio por defecto:** `fecha_postulacion` en orden descendente (más reciente primero).
- **Criterios alternativos:** Ordenación ascendente/descendente por `salario` (usando `salario_min` o `salario_max`) y por `fecha_postulacion`.

## 5. Criterios de Implementación y Restricciones
- **Manejo de fechas:** Trabajar estrictamente con la fecha local del usuario (`DD-MM-YYYY`) sin conversiones intermedias a UTC que desplacen el día natural.
- **Diseño y estilos:** Ficheros `.css` tradicionales sin utilidades en línea ni preprocesadores. Tipografía legible, disposición tabular con scroll horizontal garantizado en pantallas estrechas.
- **Portabilidad:** La aplicación debe levantarse de forma integral mediante el comando `docker compose up --build` sin requerir dependencias instaladas en la máquina host.