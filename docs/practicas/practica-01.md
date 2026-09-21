# 📋 Práctica 1: Servidores Web, Proxies y Certificados

!!! example "Alcance"
    **Bloque:** UD1 → UD3 · **Duración:** 2h · **RA/Criterios:** RA1 (a-i)

## Enunciado
Desplegar una arquitectura con Nginx como proxy inverso terminando TLS delante de un backend Apache
con PHP-FPM, sirviendo la aplicación de ejemplo de UD4.

## Entregables
1. Certificado TLS de laboratorio generado y validado con `openssl s_client`.
2. Configuración completa de Nginx (`conf.d/app-segura.conf`) con cabeceras de seguridad.
3. VirtualHost de Apache con `mod_proxy_fcgi` hacia PHP-FPM.
4. Captura de `curl -Iv` mostrando negociación TLS 1.3 y cabeceras HSTS correctas.
5. Memoria técnica (máx. 2 páginas) justificando la elección de cada directiva no trivial.

## Rúbrica orientativa
| Criterio | Peso |
|---|---|
| Certificado y TLS correctamente configurados | 25% |
| Proxy inverso funcional (Nginx → Apache) | 30% |
| Cabeceras de seguridad presentes y correctas | 20% |
| Documentación y justificación técnica | 25% |
