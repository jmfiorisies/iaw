# Nginx — Referencia Tecnológica

## 📌 Arquitectura y Fundamentos
Servidor asíncrono orientado a eventos (`epoll`), un proceso *master* + N *workers*. Ideal como
proxy inverso/balanceador y servidor de estáticos de alto rendimiento.

## ⚙️ Ficheros de Configuración, Estructura de Directorios y Rutas Clave

| Ruta | Propósito |
|---|---|
| `/etc/nginx/nginx.conf` | Configuración global |
| `/etc/nginx/conf.d/` | Bloques `server` adicionales |
| `/etc/nginx/sites-available/` `sites-enabled/` | Vhosts (convención Debian) |
| `/var/log/nginx/` | Logs de acceso y error |

## 🛠️ Comandos de Administración / Cheat Sheet CLI

```bash
nginx -t                        # Validar sintaxis
systemctl reload nginx          # Recarga sin cortar conexiones
nginx -s reopen                 # Reabrir logs tras rotación
nginx -V                        # Módulos compilados
```

## 🛡️ Hardening, Seguridad y Optimización
- `worker_processes auto;` + `worker_rlimit_nofile 65535;`.
- `limit_req_zone` para mitigar *brute-force*/DoS de capa 7.
- Cabeceras `add_header ... always;` para que se apliquen también en respuestas de error.

## 🩺 Diagnóstico, Logs y Troubleshooting
- `error.log` con `error_log /var/log/nginx/error.log warn;` para nivel adecuado en producción.
- `502 Bad Gateway` → backend caído o `proxy_pass` apuntando a puerto/socket incorrecto.
- `413 Request Entity Too Large` → ajustar `client_max_body_size`.
