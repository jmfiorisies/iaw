# PHP-FPM — Referencia Tecnológica

## 📌 Arquitectura y Fundamentos
Gestor de procesos FastCGI para PHP: mantiene un *pool* de workers persistentes, comunicándose con
el servidor web vía socket UNIX o TCP mediante el protocolo FastCGI.

## ⚙️ Ficheros de Configuración, Estructura de Directorios y Rutas Clave

| Ruta | Propósito |
|---|---|
| `/etc/php/8.3/fpm/php.ini` | Configuración del intérprete |
| `/etc/php/8.3/fpm/pool.d/www.conf` | Configuración del pool (usuario, límites) |
| `/run/php/php8.3-fpm.sock` | Socket UNIX de comunicación |
| `/var/log/php8.3-fpm.log` | Log del proceso maestro |

## 🛠️ Comandos de Administración / Cheat Sheet CLI

```bash
systemctl reload php8.3-fpm      # Recarga tras cambiar pool.d
php-fpm8.3 -t                    # Validar configuración
systemctl status php8.3-fpm      # Estado del servicio
php -m                           # Extensiones cargadas
```

## 🛡️ Hardening, Seguridad y Optimización
- `expose_php = Off`, `display_errors = Off` en producción.
- `disable_functions = exec,shell_exec,system,passthru` si no se necesita ejecución de shell.
- `opcache.enable=1` con `opcache.validate_timestamps=0` solo en producción con pipeline de deploy.

## 🩺 Diagnóstico, Logs y Troubleshooting
- `slowlog` + `request_slowlog_timeout` en `pool.d/www.conf` para detectar scripts lentos.
- `502` en el proxy → `pm.max_children` saturado o `request_terminate_timeout` alcanzado.
- `journalctl -u php8.3-fpm -f` para seguimiento en vivo.
