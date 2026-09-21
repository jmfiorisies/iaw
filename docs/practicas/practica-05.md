# 📋 Práctica 5: Servicios Cloud, Contenedores y CI/CD

!!! example "Alcance"
    **Bloque:** UD9 → UD12 · **Duración:** 2h · **RA/Criterios:** RA4 (a-h), RA6 (e-g)

## Enunciado
Desplegar Nextcloud en Docker Compose junto a la aplicación desarrollada en prácticas anteriores,
exponer una integración vía API con autenticación OAuth2, y construir un pipeline CI/CD en GitHub
Actions que valide y despliegue el stack completo.

## Entregables
1. `docker-compose.yml` funcional con `nginx` + `app` + `db` (healthchecks incluidos).
2. Cliente de integración consumiendo la API de Nextcloud con token Bearer.
3. Workflow de GitHub Actions con job `build-and-test` + `deploy` condicionado.
4. Evidencia de test de humo (`curl -f .../health`) pasando en el pipeline.

## Rúbrica orientativa
| Criterio | Peso |
|---|---|
| Stack Docker Compose funcional y seguro (no root, secrets) | 30% |
| Integración API/OAuth2 correcta | 20% |
| Pipeline CI/CD completo y condicionado a tests | 30% |
| Documentación de despliegue y rollback | 20% |
