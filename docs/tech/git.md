# Git — Referencia Tecnológica

## 📌 Arquitectura y Fundamentos
Sistema de control de versiones distribuido: cada clon es un repositorio completo con historial. Los
commits forman un grafo dirigido acíclico (DAG) identificado por hash SHA-1/SHA-256 del contenido.

## ⚙️ Ficheros de Configuración, Estructura de Directorios y Rutas Clave

| Ruta | Propósito |
|---|---|
| `.git/` | Metadatos y objetos del repositorio |
| `.gitignore` | Patrones de ficheros excluidos del versionado |
| `~/.gitconfig` | Configuración global del usuario |

## 🛠️ Comandos de Administración / Cheat Sheet CLI

```bash
git init && git add . && git commit -m "feat: ..."
git branch -M main && git remote add origin <url>
git pull --rebase origin main        # Reaplicar commits locales sobre remoto actualizado
git log --oneline --graph --all      # Visualizar historial de ramas
git bisect start                     # Búsqueda binaria de commit que introdujo un fallo
```

## 🛡️ Hardening, Seguridad y Optimización
- Nunca versionar `.env`/credenciales — usar `.gitignore` desde el primer commit.
- Convención **Conventional Commits** para trazabilidad y generación automática de changelog.
- Firmar commits (`git commit -S`) en repositorios que requieran verificación de autoría.

## 🩺 Diagnóstico, Logs y Troubleshooting
- `git status` y `git diff` antes de cualquier commit.
- `non-fast-forward` en `push` → `git pull --rebase` antes de reintentar.
- Secreto filtrado en historial → `git filter-repo` (no solo un commit de borrado, que no lo elimina del historial).
