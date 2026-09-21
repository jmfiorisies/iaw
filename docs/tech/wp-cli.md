# WP-CLI — Referencia Tecnológica

## 📌 Arquitectura y Fundamentos
Cliente oficial de línea de comandos para WordPress: ejecuta el mismo *bootstrap* que una petición
web normal, pero desde CLI — permite automatización total (cron, CI/CD) sin pasar por wp-admin.

## ⚙️ Ficheros de Configuración, Estructura de Directorios y Rutas Clave

| Ruta | Propósito |
|---|---|
| `/usr/local/bin/wp` | Binario (phar) de WP-CLI |
| `wp-cli.yml` | Configuración por proyecto (opcional) |

## 🛠️ Comandos de Administración / Cheat Sheet CLI

```bash
wp core install --url=... --title=... --admin_user=... --admin_email=...
wp user create <login> <email> --role=editor
wp plugin install <slug> --activate
wp theme install <slug> --activate
wp db export backup.sql / wp db import backup.sql
wp search-replace 'http://old.com' 'https://new.com'
wp plugin verify-checksums
wp cron event run --all
```

## 🛡️ Hardening, Seguridad y Optimización
- Ejecutar siempre como `www-data` (`sudo -u www-data wp ...`), nunca como root.
- Generar contraseñas con `openssl rand -base64 16` en vez de valores predecibles.
- Automatizar backups vía `cron` del sistema, no plugins web (menor superficie de ataque).

## 🩺 Diagnóstico, Logs y Troubleshooting
- `wp --debug <comando>` para trazas detalladas ante fallos.
- `wp core verify-checksums` valida integridad del núcleo tras instalación manual.
- `wp doctor check` (con el paquete `doctor-command`) diagnostica problemas comunes de configuración.
