# WordPress — Referencia Tecnológica

## 📌 Arquitectura y Fundamentos
CMS PHP + MySQL/MariaDB con sistema de extensión por *hooks* (`add_action`/`add_filter`). Núcleo GPL,
extensible mediante temas (presentación) y plugins (funcionalidad).

## ⚙️ Ficheros de Configuración, Estructura de Directorios y Rutas Clave

| Ruta | Propósito |
|---|---|
| `wp-config.php` | Credenciales de BD, claves de seguridad, flags de entorno |
| `wp-content/themes/` | Temas instalados |
| `wp-content/plugins/` | Plugins instalados |
| `wp-content/uploads/` | Ficheros subidos por usuarios |
| `wp-content/debug.log` | Log de errores (si `WP_DEBUG_LOG` activo) |

## 🛠️ Comandos de Administración / Cheat Sheet CLI
Ver [WP-CLI](wp-cli.md) para gestión completa vía línea de comandos.

## 🛡️ Hardening, Seguridad y Optimización
- `DISALLOW_FILE_EDIT = true` en `wp-config.php`.
- Prefijo de tabla no estándar (`table_prefix`) y `chmod 640` en ficheros PHP.
- Actualizaciones automáticas de núcleo menor (`WP_AUTO_UPDATE_CORE = 'minor'`).
- Bloquear acceso directo a `xmlrpc.php` si no se usa (vector histórico de *brute-force*).

## 🩺 Diagnóstico, Logs y Troubleshooting
- Pantalla blanca (WSOD) → activar `WP_DEBUG_LOG` temporalmente y revisar `debug.log`.
- `wp plugin verify-checksums` para detectar ficheros modificados/backdoors.
- Rendimiento lento → revisar plugins activos con `wp plugin list`, cachear con `wp-super-cache`/objeto.
