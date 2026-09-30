# MEMORY.md: Gestor de Postulaciones Laborales

Memoria del proyecto entre sesiones. Máximo ~50 líneas: sintetizar o purgar información obsoleta.

## Estado Actual
- Proyecto inicializado con Git, `.gitignore` y arnés agéntico (`SPEC.md`, `AGENTS.md`, `MEMORY.md`).
- Pendiente: Crear la estructura de carpetas (`frontend/`, `backend/`), definir los `Dockerfile` y el `docker-compose.yml` inicial.

## Decisiones Técnicas (y Justificación)
- Stack desacoplado (Next.js + FastAPI + PostgreSQL): Permite escalabilidad, tipado estricto en backend y persistencia relacional robusta.
- Docker Compose: Aislamiento total de entornos sin obligar a instalar runtimes locales en el host.
- CSS Nativo puro: Control exhaustivo de estilos y rendimiento sin dependencias de frameworks utilitarios.
- Documento `SPEC.md` dedicado: Separa el alcance funcional de las directivas operativas de `AGENTS.md`.

## Aprendizajes y Errores a Evitar
- (Registro inicial: evitar desfases de fechas locales por serialización automática a UTC).

## Próximos Pasos Inmediatos
1. Diseñar el andamiaje de carpetas: `backend/` (FastAPI), `frontend/` (Next.js) y raíz con `docker-compose.yml`.
2. Modelar la entidad `Postulacion` en el backend siguiendo la tabla de `SPEC.md`.
3. Levantar los tres contenedores y validar la conectividad FastAPI <-> PostgreSQL, sin olvidar que todos los datos sensibles, como es el caso de usuario y contraseña de la BD, deben ir en un fichero `.env`.