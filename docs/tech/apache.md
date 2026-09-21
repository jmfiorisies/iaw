# Apache HTTP Server — Referencia Tecnológica

## 📌 Arquitectura y Fundamentos
Servidor web ASF con MPMs intercambiables (`prefork`, `worker`, `event`). Procesamiento dinámico vía
módulos (`mod_php`, obsoleto) o proxy a FastCGI (`mod_proxy_fcgi` + PHP-FPM, recomendado).

## ⚙️ Ficheros de Configuración, Estructura de Directorios y Rutas Clave

| Ruta | Propósito |
|---|---|
| `/etc/apache2/apache2.conf` | Configuración global |
| `/etc/apache2/sites-available/` | VirtualHosts disponibles |
| `/etc/apache2/sites-enabled/` | VirtualHosts activos (symlinks) |
| `/etc/apache2/mods-available/` | Módulos disponibles |
| `/var/log/apache2/` | Logs de acceso y error |

## 🛠️ Comandos de Administración / Cheat Sheet CLI

```bash
a2ensite sitio.conf / a2dissite sitio.conf   # Activar/desactivar VirtualHost
a2enmod ssl rewrite headers                  # Activar módulos
apachectl configtest                         # Validar sintaxis antes de recargar
systemctl reload apache2                     # Recarga sin cortar conexiones
apache2ctl -M                                # Listar módulos cargados
apache2ctl -S                                # Listar VirtualHosts configurados
```

## 🛡️ Hardening, Seguridad y Optimización
- `ServerTokens Prod` y `ServerSignature Off` en `security.conf`.
- MPM `event` + PHP-FPM externo en vez de `mod_php` para mejor concurrencia.
- `Header always set` para cabeceras de seguridad (HSTS, X-Content-Type-Options).

## 🩺 Diagnóstico, Logs y Troubleshooting
- `tail -f /var/log/apache2/error.log` durante despliegues.
- `apache2ctl -M | grep -i php` no debe listar `php_module` si se usa FPM.
- Error 502 → revisar `pm.max_children` de PHP-FPM, no la config de Apache.
