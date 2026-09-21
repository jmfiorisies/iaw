# HTTP / TLS — Referencia Tecnológica

## 📌 Arquitectura y Fundamentos
Protocolo de aplicación sin estado (RFC 9110). TLS 1.3 (RFC 8446) cifra el transporte con *handshake*
de 1-RTT y cifrados AEAD exclusivamente. HTTP/2 (RFC 9113) multiplexa *streams* sobre una conexión TCP.

## ⚙️ Ficheros de Configuración, Estructura de Directorios y Rutas Clave

| Ruta | Propósito |
|---|---|
| `/etc/ssl/certs/` | Certificados públicos del sistema |
| `/etc/ssl/private/` | Claves privadas (permisos 600) |
| `/etc/letsencrypt/live/<dominio>/` | Certificados gestionados por Certbot |

## 🛠️ Comandos de Administración / Cheat Sheet CLI

```bash
openssl x509 -in cert.crt -noout -dates          # Vigencia del certificado
openssl s_client -connect host:443 -tls1_3       # Probar handshake TLS 1.3
certbot renew --dry-run                          # Simular renovación Let's Encrypt
curl -Iv https://host/                           # Cabeceras + negociación TLS
```

## 🛡️ Hardening, Seguridad y Optimización
- Deshabilitar TLS 1.0/1.1 (NIST SP 800-52, PCI-DSS 4.0).
- `ssl_session_tickets off;` si no se necesita reanudación de sesión entre reinicios (forward secrecy estricto).
- HSTS con `preload` tras validar que todos los subdominios sirven HTTPS.

## 🩺 Diagnóstico, Logs y Troubleshooting
- `openssl s_client -connect host:443 -brief` muestra el *cipher suite* negociado.
- Error `NET::ERR_CERT_DATE_INVALID` → revisar `openssl x509 -noout -dates`.
- `testssl.sh host` para auditoría completa de superficie TLS.
