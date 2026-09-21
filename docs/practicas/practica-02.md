# 📋 Práctica 2: Entornos Backend y Aplicaciones Multilenguaje

!!! example "Alcance"
    **Bloque:** UD4 → UD5 · **Duración:** 2h · **RA/Criterios:** RA5 (a-i)

## Enunciado
Implementar un formulario con validación server-side en PHP y una API de autenticación de sesión en
Python/FastAPI, ambas expuestas tras el proxy configurado en la Práctica 1.

## Entregables
1. Script PHP con validación mediante `filter_var` y respuesta JSON.
2. API FastAPI con login y endpoint protegido mediante token de sesión firmado.
3. Pruebas con `curl` demostrando rechazo de sesión inválida/expirada (401).
4. Unidad `systemd` funcional para el servicio Uvicorn.

## Rúbrica orientativa
| Criterio | Peso |
|---|---|
| Validación de entrada correcta en PHP | 25% |
| Aislamiento de sesión funcional en Python | 30% |
| Servicio systemd configurado y persistente | 20% |
| Pruebas documentadas (aceptación y rechazo) | 25% |
