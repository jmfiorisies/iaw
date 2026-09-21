# MariaDB — Referencia Tecnológica

## 📌 Arquitectura y Fundamentos
SGBD relacional, fork compatible con MySQL. Motor de almacenamiento por defecto InnoDB (transaccional,
ACID). Autenticación y privilegios gestionados a nivel de usuario+host (`'usuario'@'localhost'`).

## ⚙️ Ficheros de Configuración, Estructura de Directorios y Rutas Clave

| Ruta | Propósito |
|---|---|
| `/etc/mysql/mariadb.conf.d/50-server.cnf` | Configuración principal del servidor |
| `/var/lib/mysql/` | Datos de las bases de datos (InnoDB) |
| `/var/log/mysql/error.log` | Log de errores del servidor |

## 🛠️ Comandos de Administración / Cheat Sheet CLI

```bash
mysql_secure_installation                        # Hardening inicial post-instalación
mysqldump -u root -p app_iaw > backup.sql         # Backup lógico
mysql -u root -p app_iaw < backup.sql             # Restauración
mysqladmin -u root -p processlist                 # Conexiones activas
```

```sql
SHOW GRANTS FOR 'app_user'@'localhost';
EXPLAIN SELECT * FROM usuarios WHERE email = 'x';   -- Analizar plan de ejecución
```

## 🛡️ Hardening, Seguridad y Optimización
- Principio de mínimo privilegio: nunca `GRANT ALL` a usuarios de aplicación.
- `slow_query_log = ON` + `long_query_time = 1` para detectar consultas ineficientes.
- Backups cifrados en reposo y fuera del `DocumentRoot`.

## 🩺 Diagnóstico, Logs y Troubleshooting
- `SHOW PROCESSLIST;` para detectar bloqueos/consultas colgadas.
- `Too many connections` → ajustar `max_connections` o revisar fugas de conexión en la app.
- `EXPLAIN` sobre consultas del *slow log* para detectar ausencia de índices.
