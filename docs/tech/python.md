# Python (Flask / FastAPI) — Referencia Tecnológica

## 📌 Arquitectura y Fundamentos
WSGI (PEP 3333, síncrono, Flask+Gunicorn) vs ASGI (asíncrono, FastAPI+Uvicorn). El *runtime* Python
completo permanece cargado en memoria entre peticiones (a diferencia del modelo CGI clásico).

## ⚙️ Ficheros de Configuración, Estructura de Directorios y Rutas Clave

| Ruta | Propósito |
|---|---|
| `/opt/app/venv/` | Entorno virtual aislado |
| `/opt/app/main.py` | Punto de entrada ASGI/WSGI |
| `/etc/systemd/system/app-uvicorn.service` | Unidad systemd del proceso |

## 🛠️ Comandos de Administración / Cheat Sheet CLI

```bash
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000 --workers 4
gunicorn -w 4 -b 127.0.0.1:8000 main:app          # Alternativa WSGI (Flask)
systemctl restart app-uvicorn
```

## 🛡️ Hardening, Seguridad y Optimización
- `secret_key`/credenciales desde variable de entorno, nunca hardcodeadas.
- Validación de entrada con modelos `Pydantic` (tipado estricto en el borde de la API).
- `--workers N` (procesos) para paralelismo real, ya que el GIL limita concurrencia por hilo.

## 🩺 Diagnóstico, Logs y Troubleshooting
- `journalctl -u app-uvicorn -f` captura *stdout/stderr* del proceso bajo systemd.
- `500 Internal Server Error` con `DEBUG=False` → revisar logs, nunca exponer traceback al cliente.
- Fugas de memoria → revisar referencias circulares o *workers* que no reciclan (`--max-requests` en Gunicorn).
