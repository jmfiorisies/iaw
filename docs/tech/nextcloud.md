# Nextcloud — Referencia Tecnológica

## 📌 Arquitectura y Fundamentos
Plataforma de ofimática/colaboración self-hosted (PHP + BD). Protocolos estándar: WebDAV
(sincronización de ficheros), CalDAV/CardDAV (calendario/contactos), OAuth2/OIDC para integración de APIs.

## ⚙️ Ficheros de Configuración, Estructura de Directorios y Rutas Clave

| Ruta | Propósito |
|---|---|
| `config/config.php` | Configuración principal (dominios confiables, BD) |
| `/var/nextcloud_data/` | Directorio de datos (fuera del DocumentRoot) |
| `data/nextcloud.log` | Log de aplicación (JSON) |
| `occ` | CLI de administración (en la raíz de la instalación) |

## 🛠️ Comandos de Administración / Cheat Sheet CLI

```bash
sudo -u www-data php occ status
sudo -u www-data php occ maintenance:install ...
sudo -u www-data php occ user:add <usuario>
sudo -u www-data php occ user:setting <usuario> files quota "5 GB"
sudo -u www-data php occ app:install|enable|disable <app>
sudo -u www-data php occ files:scan --all
sudo -u www-data php occ integrity:check-core
```

## 🛡️ Hardening, Seguridad y Optimización
- Directorio de datos fuera del `DocumentRoot` público.
- `trusted_domains` estricto en `config.php` (mitiga Host header injection).
- Cron del sistema (`systemd timer`) en vez de AJAX para tareas programadas.

## 🩺 Diagnóstico, Logs y Troubleshooting
- `occ integrity:check-core` tras cualquier instalación/actualización manual.
- Sincronización fallida → revisar `trusted_domains` y certificado TLS válido.
- `occ log:tail` para seguimiento en vivo del log de aplicación.
