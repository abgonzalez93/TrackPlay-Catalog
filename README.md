# 🎮 TrackPlay - Catalog Service

Este microservicio se encarga de interactuar con proveedores externos de información de videojuegos (IGDB, RAWG, etc.), adaptando y normalizando las respuestas a un formato neutral para ser consumido por el backend principal. Forma parte de la arquitectura distribuida de TrackPlay y expone una API HTTP sencilla y consistente.

---

## 📌 Funcionalidad

- Selección dinámica de proveedor según la variable de entorno GAME_PROVIDER (igdb, rawg).
- Proxy y adaptación de peticiones a la API externa seleccionada.
- Transformación de filtros de dominio neutro a formato específico de cada proveedor.
- Validación de respuestas mediante Zod schemas.
- Mapeo a entidades neutrales (Game, Category, etc.) entendidas por el backend.
- Gestión centralizada de errores y logging.

---

## 🔄 Flujo de desarrollo

- El backend hace una petición HTTP a este microservicio.
- El Use Case orquesta la petición y delega en el Adapter correspondiente.
- El Adapter transforma filtros neutrales a filtros específicos del proveedor (IGDB, RAWG, etc.).
- El Rest Client ejecuta la consulta al proveedor externo.
- La respuesta se valida con Zod y se transforma en un formato neutral.
- Se devuelve una respuesta limpia y consistente al backend.

---

## 🛡️ Buenas prácticas

- Neutralidad de dominio: el backend nunca conoce los detalles del proveedor, sólo trabaja con entidades neutrales.
- Validación estricta: todas las respuestas externas se validan con Zod antes de exponerlas.
- Seguridad: las credenciales de cada proveedor se gestionan mediante variables de entorno, nunca se exponen directamente.
- Errores consistentes: todos los errores se canalizan por TrackPlayError.
- Logging unificado: el logger centralizado sigue el formato de Winston compartido en @trackplay/core.
