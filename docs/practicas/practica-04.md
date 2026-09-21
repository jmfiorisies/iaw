# 📋 Práctica 4: Gestores de Contenidos y Scripting con WP-CLI

!!! example "Alcance"
    **Bloque:** UD7 → UD8 · **Duración:** 2h · **RA/Criterios:** RA2 (a-h), RA3 (a-i)

## Enunciado
Instalar WordPress vía WP-CLI de forma no interactiva, crear usuarios con distintos roles, instalar
plugins/temas, y automatizar una copia de seguridad programada con `cron`.

## Entregables
1. Instalación completa vía `wp core install` (sin usar el asistente web).
2. Al menos 3 usuarios con roles diferenciados (`editor`, `author`, `subscriber`).
3. Backup automatizado (`wp db export` + `tar`) con entrada de `cron` funcional.
4. Salida de `wp plugin verify-checksums` documentada.

## Rúbrica orientativa
| Criterio | Peso |
|---|---|
| Instalación no interactiva correcta | 25% |
| Gestión de usuarios y roles | 20% |
| Automatización de backup con cron | 30% |
| Verificación de integridad documentada | 25% |
