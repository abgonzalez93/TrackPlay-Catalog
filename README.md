# 🎮 TrackPlay - IGDB Microservice

Este microservicio se encarga de interactuar con la API pública de IGDB para obtener información sobre videojuegos (búsquedas, detalles, filtros, etc.). Forma parte de la arquitectura distribuida de TrackPlay y es consumido por el backend principal mediante HTTP.

---

## 📌 Funcionalidad

- Proxy y adaptación de peticiones a la API de IGDB.
- Validación y transformación de filtros compatibles.
- Enriquecimiento y validación de la respuesta mediante Zod.
- Gestión centralizada de errores y logging.

---

## 🔄 Flujo de desarrollo

- El backend hace una petición HTTP al microservicio IGDB.
- Este adapta los filtros y consulta a la API oficial.
- La respuesta se valida con Zod y se transforma si es necesario.
- Se devuelve una respuesta limpia al backend.

---

## 🛡️ Buenas prácticas

- Toda respuesta de IGDB se valida y adapta antes de exponerla al backend.
- No se exponen credenciales directamente.
- Todos los errores se canalizan por ApiError.
- El logger centralizado sigue el formato de Winston compartido en @trackplay/core.
