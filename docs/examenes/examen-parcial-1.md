# 📝 Examen Parcial 1: Bloque Web (UD1-UD3)

!!! danger "Convocatoria"
    **Duración:** 2h · **RA/Criterios evaluados:** RA1 completo (a-i)

## Estructura de la prueba
1. **Teórico (40%):** arquitectura cliente-servidor, HTTP/2, TLS 1.3, diferencias Apache vs Nginx.
2. **Práctico (60%):** dado un enunciado de despliegue, configurar VirtualHost/server block con TLS,
   proxy inverso y cabeceras de seguridad; justificar cada directiva no trivial.

## Ejemplos de preguntas (ver también la autoevaluación de cada UD)
- Explica por qué MPM `event` de Apache no es compatible con `mod_php` clásico.
- Configura un bloque `location` de Nginx que sirva `/static/` desde disco y reenvíe el resto a un
  backend en `127.0.0.1:8080`, incluyendo cabeceras `X-Forwarded-*`.
- Justifica la elección de `TLSv1.3 TLSv1.2` frente a `SSLProtocol all`.
