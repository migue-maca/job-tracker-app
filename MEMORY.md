# MEMORY.md: Gestor de Postulaciones Laborales

Memoria del proyecto entre sesiones. Máximo ~50 líneas: sintetizar o purgar información obsoleta.

## Estado Actual
- Proyecto inicializado con Git, `.gitignore` y arnés agéntico (`SPEC.md`, `AGENTS.md`, `MEMORY.md`).
- Andamiaje completo generado: `backend/` (FastAPI), `frontend/` (Next.js), `docker-compose.yml`, `.env`, `.env.example`.
- Pendiente: ejecutar `docker compose up --build` y validar conectividad.

## Decisiones Técnicas (y Justificación)
- Stack desacoplado (Next.js + FastAPI + PostgreSQL): Permite escalabilidad, tipado estricto en backend y persistencia relacional robusta.
- Docker Compose: Aislamiento total de entornos sin obligar a instalar runtimes locales en el host.
- CSS Nativo puro: Control exhaustivo de estilos y rendimiento sin dependencias de frameworks utilitarios.
- Documento `SPEC.md` dedicado: Separa el alcance funcional de las directivas operativas de `AGENTS.md`.
- `create_all()`` en lugar de Alembic: uso personal, sin necesidad de migraciones versionadas.
- Credenciales en `.env` (git-ignored): docker-compose referencia variables, nunca hardcodea.
- CORS restrictivo a `http://localhost:3000`: solo el frontend puede llamar a la API.
- CSR con `useEffect`: renderizado en cliente, sin SSR.
- Fechas: API en ISO `YYYY-MM-DD`, frontend formatea a `DD-MM-YYYY` sin conversiones UTC.
- PostgreSQL sin puerto expuesto al host: solo red interna Docker.

## Aprendizajes y Errores a Evitar
- Evitar desfases de fechas locales por serialización automática a UTC.
- `tabla.css` debe importarse en `layout.tsx` (no en `page.tsx`).

## Próximos Pasos Inmediatos
1. Ejecutar `docker compose up --build` y verificar que los tres servicios arrancan.
2. Validar endpoint `/health` del backend y creación de una postulación de prueba.
3. Verificar que el frontend carga y muestra la tabla correctamente.
