# UD9: Ofimática Web Self-Hosted: Nextcloud

!!! info "Ficha Técnica y Alcance de la Unidad"
    * **Carga Lectiva:** 5 horas presenciales
    * **Resultados de Aprendizaje:** RA4 (criterios a, b, c, d)
    * **Tecnologías Involucradas:** [Nextcloud](tech/nextcloud.md), [PHP-FPM](tech/php-fpm.md), [MariaDB](tech/mariadb.md)
    * **Referencias y Estándares:** Nextcloud Server Admin Manual, OWASP File Upload Cheat Sheet

---

## 📖 1. Fundamentos Teóricos y Arquitectura

Las aplicaciones de **ofimática web** (procesador de textos, hoja de cálculo, calendario, sincronización
de archivos) sustituyen suites de escritorio locales por acceso multi-dispositivo con almacenamiento
centralizado. Nextcloud es la referencia *open source* self-hosted (alternativa soberana a
Google Workspace/Office 365), con arquitectura de *apps* modulares sobre núcleo PHP + BD.

```mermaid
graph TD
    U[Usuarios/Clientes desktop-móvil] -->|WebDAV/CalDAV/CardDAV| NC[Nextcloud Core]
    NC --> DB[(MariaDB)]
    NC --> FS[/var/nextcloud_data]
    NC --> Apps[Office, Talk, Calendar...]
```

El protocolo **WebDAV** habilita sincronización de ficheros tipo Dropbox; **CalDAV/CardDAV** sincronizan
calendarios y contactos con clientes nativos (Thunderbird, apps móviles) sin dependencia de un
ecosistema propietario.

## ⚙️ 2. Instalación, Configuración Avanzada y Hardening

```bash title="Preparación de entorno y BD dedicada" linenums="1"
apt install -y php8.3-fpm php8.3-gd php8.3-zip php8.3-curl php8.3-mbstring php8.3-intl php8.3-bcmath
mysql -u root -p -e "CREATE DATABASE nextcloud CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  CREATE USER 'nc_user'@'localhost' IDENTIFIED BY 'SECRETO_FUERTE';
  GRANT ALL PRIVILEGES ON nextcloud.* TO 'nc_user'@'localhost'; FLUSH PRIVILEGES;"
```

```bash title="Instalación no interactiva vía occ (CLI de Nextcloud)" linenums="1"
cd /var/www/nextcloud
sudo -u www-data php occ maintenance:install \
  --database "mysql" --database-name "nextcloud" \
  --database-user "nc_user" --database-pass "SECRETO_FUERTE" \
  --admin-user "admin_iaw" --admin-pass "$(openssl rand -base64 16)" \
  --data-dir "/var/nextcloud_data"
```

```php title="config/config.php — parámetros críticos de producción" linenums="1"
'trusted_domains' => ['app.iaw.local'],
'overwriteprotocol' => 'https',
'default_phone_region' => 'ES',
'maintenance_window_start' => 1,   // mantenimiento fuera de horario lectivo
```

!!! danger "Seguridad y Hardening (CIS / CCN-CERT / OWASP)"
    El directorio de datos (`/var/nextcloud_data`) debe residir **fuera** del `DocumentRoot`; si
    coincide con él, un fichero `.htaccess`/vhost mal aplicado expondría archivos de usuario directamente.

## 🛠️ 3. Laboratorio Práctico Dirigido

```bash title="Verificación de integridad y estado tras instalación" linenums="1"
sudo -u www-data php occ status
sudo -u www-data php occ integrity:check-core
sudo -u www-data php occ app:list --enabled
```

```bash title="Gestión de cuotas y usuarios desde CLI" linenums="1"
sudo -u www-data php occ user:add alumno01 --display-name="Alumno 01" --group="alumnado"
sudo -u www-data php occ user:setting alumno01 files quota "5 GB"
```

## 🛡️ 4. Seguridad, Logs y Optimización de Rendimiento

* Logs: `data/nextcloud.log` (JSON estructurado); nivel configurable en `config.php` (`loglevel`).
* Tarea programada (`cron.php`) vía `systemd timer` en vez de `AJAX` (recomendación oficial para
  entornos con tráfico bajo/medio, evita depender de visitas de usuario para disparar tareas).
* `occ files:scan` reindexación tras cambios directos en filesystem fuera de la interfaz web.

## ❓ 5. Preguntas y Casos de Autoevaluación

1. **¿Por qué el directorio de datos debe estar fuera del `DocumentRoot`?**
   *Resolución:* Si el servidor web sirve ese directorio directamente, cualquier fichero subido por
   un usuario sería accesible por URL directa, saltándose el control de acceso de la aplicación.

2. **Un cliente de escritorio no sincroniza tras cambiar el dominio del servidor. Causa probable.**
   *Resolución:* El nuevo dominio no está en `trusted_domains` de `config.php`; Nextcloud rechaza
   peticiones con cabecera `Host` no confiada como medida anti-*Host header injection*.

3. **¿Qué verifica `occ integrity:check-core` y por qué es relevante tras una instalación manual?**
   *Resolución:* Compara los ficheros del núcleo contra las sumas de verificación oficiales,
   detectando corrupción de descarga o modificación no autorizada antes de poner el servicio en producción.

4. **Diferencia entre cron del sistema y AJAX para las tareas programadas de Nextcloud.**
   *Resolución:* AJAX dispara tareas solo cuando un usuario visita el sitio (poco fiable con tráfico
   bajo); `systemd timer`/cron ejecuta `cron.php` a intervalo fijo independientemente del tráfico.

5. **¿Qué riesgo mitiga establecer una cuota de almacenamiento por usuario (`occ user:setting ... quota`)?**
   *Resolución:* Previene agotamiento de disco por un único usuario (intencional o accidental),
   garantizando disponibilidad del servicio para el resto de la comunidad educativa.
