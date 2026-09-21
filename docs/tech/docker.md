# Docker y Docker Compose — Referencia Tecnológica

## 📌 Arquitectura y Fundamentos
Contenerización basada en *namespaces* (aislamiento de PID, red, filesystem) y *cgroups* (límites de
recursos) del kernel Linux. Imágenes en capas *overlay* inmutables (especificación OCI).

## ⚙️ Ficheros de Configuración, Estructura de Directorios y Rutas Clave

| Ruta | Propósito |
|---|---|
| `Dockerfile` | Receta de construcción de la imagen |
| `docker-compose.yml` | Definición declarativa del stack multi-contenedor |
| `/var/lib/docker/` | Almacenamiento de imágenes/contenedores en el host |
| `.dockerignore` | Exclusión de ficheros del contexto de build |

## 🛠️ Comandos de Administración / Cheat Sheet CLI

```bash
docker build -t app:tag .
docker compose up -d --build / docker compose down -v
docker compose logs -f <servicio> --tail=50
docker exec -it <contenedor> sh
docker stats --no-stream
docker system prune -a              # Limpieza de recursos no usados
```

## 🛡️ Hardening, Seguridad y Optimización
- `USER <no-root>` en el Dockerfile; nunca ejecutar el proceso principal como root.
- `secrets:` en Compose para credenciales, no `environment:`.
- Escaneo de vulnerabilidades de imagen (Trivy/Grype) antes de publicar en registry.
- Límites de recursos (`--memory`, `--cpus`) por contenedor en hosts compartidos.

## 🩺 Diagnóstico, Logs y Troubleshooting
- `docker compose logs -f <servicio>` para *stdout/stderr* en vivo.
- Contenedor en `Restarting` continuo → revisar `docker inspect` y logs del healthcheck.
- `docker stats` para descartar saturación de CPU/RAM antes de escalar.
