# GitHub Actions (CI/CD) — Referencia Tecnológica

## 📌 Arquitectura y Fundamentos
Motor de automatización basado en eventos del repositorio (`push`, `pull_request`, `schedule`).
Un *workflow* (YAML) define *jobs* con *steps*; cada job corre en un *runner* aislado (VM efímera).

## ⚙️ Ficheros de Configuración, Estructura de Directorios y Rutas Clave

| Ruta | Propósito |
|---|---|
| `.github/workflows/*.yml` | Definición de pipelines |
| Settings → Secrets and variables | Almacén cifrado de credenciales del repositorio |
| Pestaña **Actions** del repo | Historial y logs de ejecuciones |

## 🛠️ Comandos de Administración / Cheat Sheet CLI

```yaml
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t app:${{ github.sha }} .
```

```bash
gh workflow run ci-cd.yml         # Disparar manualmente (GitHub CLI)
gh run list --workflow=ci-cd.yml  # Ver ejecuciones recientes
gh run view <run-id> --log        # Ver log completo de una ejecución
```

## 🛡️ Hardening, Seguridad y Optimización
- Credenciales siempre en `secrets.*`, nunca en el YAML en claro.
- `permissions:` mínimas explícitas por workflow (principio de mínimo privilegio del `GITHUB_TOKEN`).
- Fijar versión de *actions* de terceros por SHA, no por tag mutable (`@v4` puede repointearse).

## 🩺 Diagnóstico, Logs y Troubleshooting
- Pestaña **Actions** conserva log completo por step de cada ejecución.
- Fallo silencioso en un step → revisar `continue-on-error` accidental.
- Secret no sustituido en logs → GitHub enmascara automáticamente valores que coincidan exactamente
  con el secreto registrado; evitar transformaciones del valor que rompan ese enmascarado.
