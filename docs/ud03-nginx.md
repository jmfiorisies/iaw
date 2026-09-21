# UD3: Servidores de Alto Rendimiento: Nginx

!!! info "Ficha Técnica y Alcance de la Unidad"
    * **Carga Lectiva:** 4 horas presenciales
    * **Resultados de Aprendizaje:** RA1 (criterios g, h, i)
    * **Tecnologías Involucradas:** [Nginx](tech/nginx.md)
    * **Referencias y Estándares:** CIS Nginx Benchmark, OWASP Secure Headers Project, RFC 7239 (X-Forwarded-For)

---

## 📖 1. Fundamentos Teóricos y Arquitectura

### 1.1 ¿Qué es un proxy inverso y por qué necesitamos uno?

Un **proxy** es un intermediario que recibe peticiones en nombre de otro. Ya conoces el "proxy
directo" (habitual en institutos/empresas): un servidor por el que *el cliente* pasa para salir a
Internet, normalmente para filtrar contenido. Un **proxy inverso** hace lo contrario: se coloca
delante *del servidor*, y es el propio servidor el que oculta su arquitectura interna detrás de él.

Imagina la recepción de un hotel: los huéspedes (clientes) siempre hablan con la recepción
(proxy inverso), nunca directamente con el departamento de limpieza, mantenimiento o cocina
(servidores internos). La recepción decide a qué departamento redirigir cada petición, y el huésped
ni siquiera necesita saber cuántos departamentos hay ni dónde están físicamente.

En nuestra arquitectura, Nginx cumplirá ese papel: recibirá **todas** las peticiones de Internet,
terminará el cifrado TLS ahí mismo, y decidirá si servir un fichero estático directamente o reenviar
la petición a otro programa interno (Apache, o en UD5 una aplicación Python) que no está expuesto
directamente a Internet.

### 1.2 ¿Por qué Nginx es más eficiente que el modelo por proceso de Apache?

En UD2 vimos que Apache puede usar un proceso o un hilo por cada conexión. Nginx sigue un enfoque
distinto: un modelo **asíncrono orientado a eventos**. En vez de "un trabajador dedicado por
cliente", Nginx tiene un número reducido de procesos *worker* que van atendiendo miles de conexiones
sin bloquearse esperando a ninguna de ellas — de forma parecida a un único camarero muy ágil que va
tomando nota en varias mesas mientras la cocina prepara cada plato, en vez de un camarero fijo
esperando parado junto a cada mesa hasta que su plato esté listo.

Técnicamente, esto se apoya en mecanismos del kernel de Linux como `epoll`, que permiten a un
programa preguntar "¿hay alguna de estas mil conexiones con datos nuevos?" de forma muy eficiente, en
vez de tener que revisarlas una a una constantemente.

```mermaid
graph LR
    Internet -->|443| N[Nginx: TLS + estáticos]
    N -->|proxy_pass /app| A[Apache/Gunicorn backend]
    N -->|try_files| S[/var/www/static]
```

Esta arquitectura es idónea como **proxy inverso / balanceador** delante de Apache, PHP-FPM o
aplicaciones Python (Gunicorn/Uvicorn, ver UD5), terminando TLS y sirviendo estático de forma muy
eficiente sin sobrecargar a los servidores de aplicación con ese trabajo.

### 1.3 Lo que el backend deja de "ver" al estar detrás de un proxy

Cuando Nginx reenvía una petición al backend, esa conexión interna es *nueva*: el backend recibiría
como IP de origen la del propio Nginx, no la del cliente real, salvo que se lo digamos explícitamente
mediante cabeceras HTTP adicionales (esto se resuelve con `X-Forwarded-*`, que veremos en la
configuración). Es importante entenderlo bien porque es una fuente de errores muy habitual: un log de
acceso del backend que muestre siempre la misma IP casi siempre significa que faltan esas cabeceras.

## ⚙️ 2. Instalación, Configuración Avanzada y Hardening

```bash title="Instalación desde el repositorio oficial de Nginx" linenums="1"
curl -fsSL https://nginx.org/keys/nginx_signing.key | gpg --dearmor -o /usr/share/keyrings/nginx.gpg
echo "deb [signed-by=/usr/share/keyrings/nginx.gpg] http://nginx.org/packages/ubuntu $(lsb_release -cs) nginx" \
  > /etc/apt/sources.list.d/nginx.list
apt update && apt install -y nginx
```

Usamos el repositorio oficial de Nginx (en vez del paquete de Ubuntu/Debian) para tener siempre la
versión más reciente con los últimos parches de seguridad; `gpg --dearmor` importa la clave con la
que el repositorio firma sus paquetes, para que `apt` pueda verificar que no han sido manipulados.

```nginx title="/etc/nginx/conf.d/app-segura.conf" linenums="1"
server {
    listen 443 ssl;
    http2 on;
    server_name app.iaw.local;

    ssl_certificate     /etc/ssl/lab/lab.crt;
    ssl_certificate_key /etc/ssl/lab/lab.key;
    ssl_protocols TLSv1.3 TLSv1.2;
    ssl_session_cache shared:SSL:10m;

    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /var/www/app/static/;
        expires 30d;
        access_log off;
    }
}
server {
    listen 80;
    server_name app.iaw.local;
    return 301 https://$host$request_uri;
}
```

Cada bloque `location` le dice a Nginx cómo tratar peticiones según la ruta pedida: el bloque `/`
reenvía (`proxy_pass`) todo lo que no sea explícitamente estático hacia el backend interno en el
puerto 8080 (por ejemplo, el Apache configurado en UD2); el bloque `/static/` sirve directamente los
ficheros de ese directorio sin pasar por el backend, mucho más rápido para imágenes/CSS/JS. El
segundo bloque `server` (puerto 80) simplemente redirige cualquier visita sin cifrar hacia la versión
HTTPS (`301` = redirección permanente).

`X-Forwarded-For`/`X-Forwarded-Proto` (RFC 7239) son imprescindibles para que el backend conozca la IP
y esquema originales del cliente cuando Nginx actúa como proxy inverso; sin ellos, logs y control de
acceso del backend verían siempre `127.0.0.1`, como se explicaba en el punto 1.3.

!!! example "Laboratorio / Despliegue Real"
    Plataforma integrada de prueba: `nginx -t` valida sintaxis sin recargar el servicio en producción.

## 🛠️ 3. Laboratorio Práctico Dirigido

```bash title="Validar y recargar sin cortar conexiones activas" linenums="1"
nginx -t && systemctl reload nginx
curl -I http://app.iaw.local/        # Debe responder 301 -> https
curl -Ik https://app.iaw.local/      # Debe responder 200 con cabeceras HSTS
```

`systemctl reload` (a diferencia de `restart`) aplica la nueva configuración sin cerrar las
conexiones ya activas: Nginx termina de atender las peticiones en curso con la configuración antigua
y empieza a usar la nueva para las siguientes — imprescindible en un servidor en producción con
usuarios conectados.

## 🛡️ 4. Seguridad, Logs y Optimización de Rendimiento

* `worker_processes auto;` y `worker_rlimit_nofile 65535;` en `nginx.conf`: alinea el nº de workers con
  los núcleos de CPU y eleva el límite de descriptores de fichero del kernel por proceso, evitando
  `Too many open files` bajo alta concurrencia.
* Logs: `/var/log/nginx/access.log` y `error.log`; formato JSON recomendado para ingesta en SIEM.
* `limit_req_zone` mitiga *brute-force* y *DoS* de capa 7 sin depender del backend.

```nginx title="Rate limiting básico" linenums="1"
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/s;
location /login {
    limit_req zone=login burst=10 nodelay;
    proxy_pass http://127.0.0.1:8080;
}
```

Esta configuración limita a 5 peticiones por segundo por IP (`rate=5r/s`) a la ruta `/login`,
permitiendo un pequeño margen de ráfaga (`burst=10`) antes de empezar a rechazar peticiones —
mitigando intentos automatizados de adivinar contraseñas sin bloquear a un usuario legítimo que
simplemente se equivoca una vez.

## ❓ 5. Preguntas y Casos de Autoevaluación

1. **¿Por qué Nginx soporta más conexiones concurrentes con menos RAM que Apache prefork?**
   *Resolución:* Modelo asíncrono orientado a eventos (un worker atiende miles de conexiones no
   bloqueantes) frente a un proceso por conexión con su propio *stack* de memoria.

2. **Un cliente detrás del proxy ve siempre la IP del servidor en los logs del backend. ¿Causa?**
   *Resolución:* Faltan las cabeceras `X-Real-IP`/`X-Forwarded-For` en el bloque `proxy_pass`, o el
   backend no está configurado para confiar en `X-Forwarded-*` (p. ej. `RemoteIPHeader` en Apache).

3. **¿Qué diferencia hay entre `alias` y `root` en un bloque `location` de Nginx?**
   *Resolución:* `root` concatena la ruta del `location` a la ruta base; `alias` sustituye la ruta del
   `location` completa por la especificada — error común al servir subdirectorios estáticos.

4. **Justifica el uso de `limit_req_zone` frente a bloquear IPs manualmente.**
   *Resolución:* Es dinámico y basado en tasa (r/s) sin mantenimiento de listas; complementa (no
   sustituye) un WAF/fail2ban para bloqueo persistente tras umbral de abuso.

5. **¿Qué aporta `worker_rlimit_nofile` respecto al límite por defecto del sistema?**
   *Resolución:* El límite de descriptores de fichero por proceso del kernel (`ulimit -n`) suele ser
   1024 por defecto; en un proxy con miles de conexiones simultáneas hay que elevarlo explícitamente
   o Nginx rechazará nuevas conexiones con `EMFILE`.
