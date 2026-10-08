# AGENTS.md: Gestor de Postulaciones Laborales

Aplicación web profesional para registrar, filtrar y ordenar postulaciones de empleo.

## Especificaciones y Requisitos
- Consulta siempre `SPEC.md` para entender el modelo de datos, la arquitectura y los requisitos funcionales antes de realizar cualquier cambio.

## Stack y Estructura
- Frontend: Next.js (App Router, React). Estilos estrictamente en ficheros `.css` nativos separados (sin Tailwind ni CSS-in-JS).
- Backend: Python con FastAPI, Pydantic v2 y SQLAlchemy/SQLModel.
- Persistencia: PostgreSQL.
- Infraestructura: Multi-contenedor con Docker y Docker Compose (`docker-compose.yml` en la raíz con servicios `frontend`, `backend` y `db`).
- Patrón: Respetar la separación en capas en backend (Router -> Service -> Repository) y modularidad por features en frontend. No mezclar lógica de negocio ni queries SQL en los routers.

## Comandos Operativos
- Despliegue completo: `docker compose up --build`
- Logs del sistema: `docker compose logs -f`
- Migraciones / Shell backend: `docker compose exec backend bash`

## Convenciones de Código
- Idioma: Textos de la interfaz y mensajes de usuario en español; nombres de variables, endpoints, comentarios de código y código en inglés coherente según `SPEC.md`.
- Todo el código debe estar bien comentado, de manera que cualquiera pueda entender lo que hace cada parte.
- Fechas: Guardar y operar siempre con fechas según la norma oficial de España y Europa (`DD-MM-YYYY`). Prohibido hacer conversiones UTC que desplacen el día natural.

## Memoria del Proyecto
- Al iniciar una sesión o tarea, lee `MEMORY.md` para conocer el estado y el contexto reciente.
- Al finalizar cada tarea, actualiza `MEMORY.md`: actualiza el estado actual, registra decisiones técnicas tomadas (y su porqué) y anota aprendizajes o errores a evitar.
- Mantén `MEMORY.md` breve (máximo ~50 líneas).

## Límites y Guardarraíles
- Siempre: Respetar el esquema de `SPEC.md`, usar CSS nativo y mantener la aplicación desplegable vía Docker.
- Pregunta antes: Añadir nuevas dependencias externas a `package.json` o `requirements.txt`, o modificar esquemas de la base de datos.
- Nunca: Instalar utilidades CSS alternativas (Tailwind, Bootstrap), romper la estructura de contenedores o eliminar datos persistidos sin confirmación.

## Skills de UI y Frontend

Cuando diseñes o modifiques interfaces web, estilos o componentes orientados al usuario, adiérete estrictamente a las guías definidas en:
- `.agents/skills/web-design-guidelines/SKILL.md`
- `.agents/skills/frontend-design/SKILL.md`

## Implementación de nuevas features y de modificaciones de otras ya existentes o de errores identificados

Cuando se vaya a abordar cualquier tarea que tenga cierta relevancia, utiliza la siguiente skill para definir lo mejor posible antes de construir:
- `.agents/skills/grill-me/SKILL.md`