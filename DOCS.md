# Cristian Crovato — Documentación del Proyecto

## Tabla de contenidos
1. [Qué es este proyecto](#1-qué-es-este-proyecto)
2. [Cómo funciona todo junto](#2-cómo-funciona-todo-junto)
3. [Infraestructura](#3-infraestructura)
4. [Entorno de desarrollo local](#4-entorno-de-desarrollo-local)
5. [Estructura del proyecto](#5-estructura-del-proyecto)
6. [El CMS (Panel de administración)](#6-el-cms-panel-de-administración)
7. [Flujo de trabajo para actualizar el sitio](#7-flujo-de-trabajo-para-actualizar-el-sitio)
8. [Diseño y sistema de colores](#8-diseño-y-sistema-de-colores)
9. [Variables de entorno](#9-variables-de-entorno)
10. [Comandos útiles](#10-comandos-útiles)
11. [Estado actual y próximos pasos](#11-estado-actual-y-próximos-pasos)

---

## 1. Qué es este proyecto

Sitio web de portfolio y captación de leads para **Cristian Crovato**, escultor argentino con base en Córdoba.

**Objetivo principal**: que el visitante vea las obras y haga clic en el botón de WhatsApp. Toda venta se cierra por WhatsApp — el sitio no tiene carrito ni checkout.

**Fuentes de tráfico esperadas**: Instagram orgánico + Meta Ads (Fase 2). Mayoría en móvil.

**Páginas públicas:**
| Ruta | Qué hace |
|------|----------|
| `/` | Homepage con hero y obras destacadas |
| `/obras` | Galería completa de esculturas |
| `/obras/[slug]` | Detalle de cada obra con CTA de WhatsApp |
| `/sobre-mi` | Historia, proceso de trabajo y cobertura en medios |
| `/clientes` | Coleccionistas reales con fotos de sus colecciones |
| `/contacto` | Perfil estilo ArtStation con links a WhatsApp e Instagram |
| `/admin` | Panel de administración (privado, solo Cristian) |

---

## 2. Cómo funciona todo junto

```
Visitante
    │
    ▼
Cloudflare CDN  ←── cachea assets estáticos, protege, entrega global
    │
    ▼
Railway (São Paulo)  ←── servidor Node.js corriendo Next.js + Payload CMS
    │
    ├── Next.js 15  ──→  renderiza las páginas públicas (/obras, etc.)
    │
    └── Payload CMS ──→  admin en /admin, API en /api/*
            │
            ▼
        PostgreSQL 16 (Railway managed)
            └── tabla `works` ── obras con fotos, precios, estado
            └── tabla `media` ── metadatos de imágenes
            └── tabla `users` ── usuario admin (Cristian)
```

**Flujo de una visita:**
1. El visitante entra a `cristian-crovato.com/obras/batman-battle-damaged`
2. Cloudflare sirve la página desde su caché si ya existe
3. Si no está en caché, Railway responde: Next.js busca la obra en PostgreSQL a través de Payload, renderiza el HTML y lo devuelve
4. El visitante ve la obra y hace clic en "Consultar por esta obra"
5. Se abre WhatsApp con el mensaje pre-cargado: *"Hola Cristian, me interesa la escultura Batman Battle Damaged"*
6. Cristian cierra la venta por WhatsApp

**¿Por qué Next.js + Payload en el mismo proceso?**
En lugar de tener dos servidores separados (uno para el frontend, otro para el CMS), ambos corren en el mismo contenedor Node.js. Eso reduce costos y latencia: cuando Next.js necesita datos de una obra, los pide directamente a Payload sin hacer una llamada HTTP externa.

---

## 3. Infraestructura

### En producción (Railway + Cloudflare)

```
Internet
    │
    ▼
┌─────────────────────────────┐
│  Cloudflare (free tier)     │
│  - CDN global               │
│  - SSL/TLS automático       │
│  - DDoS protection          │
│  - Caché de assets          │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Railway — São Paulo        │
│                             │
│  ┌───────────────────────┐  │
│  │  Contenedor Next.js   │  │
│  │  + Payload CMS        │  │
│  │  Node.js 20           │  │
│  │  Puerto 3000          │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │  PostgreSQL 16        │  │
│  │  (Railway managed)    │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

- **Railway** ejecuta un contenedor Docker construido desde `docker/next/Dockerfile` (stage `production`).
- **Imágenes subidas** (fotos de esculturas) se guardan en el sistema de archivos del contenedor bajo `public/media/`. En Railway esto persiste mientras el contenedor vive. Para persistencia real en producción se puede migrar a un bucket S3-compatible (mejora futura).
- **Cloudflare** se pone delante del dominio. Así Cristian accede desde Argentina y un comprador de Europa obtiene la página desde un servidor de Cloudflare cercano a ellos, no desde São Paulo.
- **Costo estimado**: ~$10–15 USD/mes en Railway. Cloudflare gratis.

### En desarrollo local

```
Tu máquina (macOS)
│
├── Docker Desktop
│   ├── contenedor: cristian-next   (puerto 3001 → 3000 interno)
│   │   └── Next.js dev server con hot reload
│   │   └── Payload CMS integrado
│   └── contenedor: cristian-db    (puerto 5432)
│       └── PostgreSQL 16
│
└── Tu editor (VSCode / Cursor)
    └── Los archivos en /CristianCrovato se montan dentro del contenedor
        → Cualquier cambio en el código se refleja instantáneamente
```

Puerto local: **http://localhost:3001**
Admin local: **http://localhost:3001/admin**

---

## 4. Entorno de desarrollo local

### Requisitos
- Docker Desktop instalado y corriendo
- Claude Code con Playwright MCP (para ver el sitio en tiempo real)

### Iniciar el entorno
```bash
cd /Users/agustincrovato/CristianCrovato
docker-compose up -d
```

### Ver los logs
```bash
docker-compose logs next --tail=50 -f
```

### Parar todo
```bash
docker-compose down
```

### Después de instalar un paquete npm nuevo
```bash
docker-compose build --no-cache next && docker-compose up -d
```

### Si la base de datos quedó en mal estado
```bash
docker-compose down -v    # elimina volúmenes (BORRA los datos)
docker-compose up -d
```

> ⚠️ `down -v` elimina la base de datos local. No hay problema porque los datos de producción están en Railway. Pero si cargaste datos de prueba locales que querés conservar, no lo hagas.

### Hot reload
El contenedor de Next.js monta tu carpeta local como volumen. Cuando guardás un archivo `.tsx`, `.ts` o `.css`, Next.js lo detecta y recarga automáticamente el navegador en segundos — sin reiniciar el contenedor.

La excepción son los cambios en `next.config.ts` o `package.json`: estos requieren reiniciar el contenedor (`docker-compose restart next`).

---

## 5. Estructura del proyecto

```
CristianCrovato/
├── docker-compose.yml          # Define los servicios Docker (next, db)
├── next.config.ts              # Next.js config: imágenes, headers de seguridad, Payload wrapper
├── tailwind.config.ts          # Diseño: colores, fuentes, tokens
├── CLAUDE.md                   # Instrucciones para el asistente de IA
├── DOCS.md                     # Este archivo
├── .env                        # Variables de entorno (NO commitear)
│
├── docker/
│   ├── next/Dockerfile         # Build del contenedor Next.js (dev + producción)
│   └── playwright/Dockerfile   # Contenedor para tests e2e (solo dev/CI)
│
├── playwright/
│   └── tests/                  # Tests end-to-end (vacío por ahora)
│
└── src/
    ├── payload.config.ts       # Configuración central de Payload CMS
    │
    ├── collections/
    │   ├── Works.ts            # Esquema de obras (todos los campos del CMS)
    │   ├── Media.ts            # Uploads de imágenes (3 tamaños auto-generados, acceso público)
    │   └── Users.ts            # Usuario administrador (autenticación)
    │
    ├── app/
    │   ├── globals.css         # Variables CSS globales + tokens de diseño
    │   ├── icon.jpg            # Favicon del sitio (auto-detectado por Next.js)
    │   │
    │   ├── (public)/           # Sitio público — tiene su propio <html><body>
    │   │   ├── layout.tsx      # Fuentes + Navbar + Footer
    │   │   ├── page.tsx        # Homepage (/)
    │   │   ├── obras/
    │   │   │   ├── page.tsx    # Galería (/obras)
    │   │   │   └── [slug]/
    │   │   │       └── page.tsx # Detalle de obra (/obras/batman-...)
    │   │   ├── sobre-mi/
    │   │   │   └── page.tsx    # Historia, proceso y prensa (/sobre-mi)
    │   │   ├── clientes/
    │   │   │   └── page.tsx    # Fotos de coleccionistas (/clientes)
    │   │   └── contacto/
    │   │       └── page.tsx    # Perfil de contacto (/contacto)
    │   │
    │   └── (payload)/          # Admin — tiene su propio <html><body> vía Payload
    │       ├── layout.tsx      # CSS de Payload + RootLayout
    │       └── admin/
    │           ├── [[...segments]]/
    │           │   └── page.tsx  # Catch-all: /admin, /admin/collections/*, etc.
    │           └── importMap.js  # Auto-generado por Payload (no editar)
    │
    │   ⚠️  No existe root app/layout.tsx — cada route group tiene su propio <html><body>.
    │      Por esto, app/not-found.tsx no es posible (Next.js lo exige envuelto en un root
    │      layout). Los archivos not-found.tsx y error.tsx viven dentro de (public)/ y
    │      cubren todos los casos reales de visitantes. Rutas totalmente desconocidas
    │      (ej: /foo) muestran el 404 por defecto de Next.js — aceptable para este sitio.
    │
    ├── components/
    │   ├── Navbar.tsx          # Barra de navegación fija (con WhatsApp)
    │   └── Footer.tsx          # Pie de página
    │
    ├── features/
    │   ├── gallery/
    │   │   ├── GalleryGrid.tsx   # Layout de la grilla (responsive 1/2/3 columnas)
    │   │   ├── WorkCard.tsx      # Tarjeta de obra (imagen + badge + precios)
    │   │   ├── ProfileSidebar.tsx # Sidebar con foto de perfil en /obras
    │   │   └── queries.ts        # getPublishedWorks() y getWorkBySlug()
    │   │
    │   └── work-detail/
    │       ├── WorkDetail.tsx    # Layout detalle: fotos + specs + CTA + "Otras obras"
    │       ├── PhotoGallery.tsx  # Galería interactiva (imagen principal + miniaturas)
    │       └── WhatsAppButton.tsx # Botón cobre "Consultar por esta obra"
    │
    └── lib/
        ├── currency.ts         # formatARS() y formatUSD() con Intl.NumberFormat
        └── whatsapp.ts         # getWhatsAppUrl() — genera el link de WhatsApp
```

### Imágenes estáticas (`public/`)

Las imágenes estáticas del sitio (no las obras del CMS) se guardan en `public/` con nombres descriptivos:

| Archivo(s) | Usado en |
|------------|----------|
| `heroes.jpg` | Homepage — imagen hero de fondo |
| `cristian-profile.jpg` | Contacto, Sobre mí, sidebar de Obras |
| `articulo-1/2/3.jpg` | Sobre mí — cobertura en medios |
| `proceso-taller.jpg` | Sobre mí — banner del taller |
| `proceso-materiales/modelado/molde/copias/pintado.jpg` | Sobre mí — las 5 etapas del proceso |
| `client-1` … `client-11b.jpg` | Clientes — fotos de coleccionistas |

---

## 6. El CMS (Panel de administración)

**URL**: `http://localhost:3001/admin` (local) o `https://tu-dominio.com/admin` (producción)
**Usuario**: Cristian (email + contraseña)

### Colección: Works (Obras)

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| Nombre | Texto | Sí | Título de la obra |
| URL (slug) | Texto único | Sí | Identificador en la URL, ej: `batman-battle-damaged` |
| Fotos | Array de imágenes | Sí (mínimo 1) | Se suben desde tu computadora |
| Descripción | Texto enriquecido | No | Descripción larga con formato |
| Materiales | Texto | No | Ej: "Resina, poliuretano, pintura acrílica" |
| Dimensiones | Texto | No | Ej: "38 cm de altura" |
| Tipo | Selección | Sí | "Por encargo" o "Disponible" |
| Precio (ARS) | Número | No | Precio en pesos — vos lo fijás manualmente |
| Precio (USD) | Número | No | Referencia para compradores internacionales |
| Tiempo de producción | Texto | No | Ej: "4–6 semanas" o "Entrega inmediata" |
| Estado | Selección | Sí | "Publicado" o "Borrador" |
| Descripción SEO | Textarea | No | Para Google, máx 160 caracteres |

**Solo las obras con Estado = "Publicado" aparecen en el sitio.**

### Colección: Media (Imágenes)

Cuando subís una foto, Payload genera automáticamente **3 versiones**:
- `thumbnail` (400×400px) — para el admin y carga rápida
- `card` (800×800px) — para las tarjetas de la galería
- `full` (1600px de ancho) — para la foto principal en detalle de obra

Esto significa que el sitio siempre carga el tamaño apropiado según dónde se muestra la imagen.

### Colección: Users

Un solo usuario administrador (Cristian). Si Cristian olvida su contraseña, Payload tiene un flujo de reset por email (requiere configurar SMTP — pendiente).

---

## 7. Flujo de trabajo para actualizar el sitio

### Agregar una obra nueva (Cristian lo hace solo)

1. Entrar a `/admin`
2. Ir a **Works → Create New**
3. Completar: Nombre, Slug, subir Fotos, Materiales, Dimensiones, Tipo, Precios, Tiempo de producción
4. Cambiar Estado de "Borrador" a "Publicado"
5. Hacer clic en **Save**
6. La obra aparece automáticamente en `/obras` y tiene su página en `/obras/[slug]`

> El slug se genera manualmente. Debe ser en minúsculas, con guiones en lugar de espacios, sin caracteres especiales. Ej: el título "Batman Battle Damaged" → slug `batman-battle-damaged`.

### Actualizar el código (lo hace Agustín con Claude Code)

1. Claude Code edita los archivos `.tsx` / `.ts` en `/CristianCrovato/src/`
2. El hot reload del contenedor aplica los cambios en segundos (sin reiniciar)
3. Se verifica con Playwright MCP que el resultado visual es correcto
4. Cuando está listo para producción: `git push` → Railway detecta el push y hace deploy automático

### Agregar un campo nuevo al CMS

1. Editar `src/collections/Works.ts` — agregar el campo
2. El contenedor detecta el cambio y reinicia el servidor de Next.js
3. Payload auto-migra la base de datos: agrega la columna en PostgreSQL automáticamente
4. El campo aparece en el admin panel inmediatamente

### Hacer deploy a producción (Railway)

Cuando el sitio esté conectado a Railway con autodeploy desde GitHub:
1. `git add . && git commit -m "descripción del cambio"`
2. `git push origin main`
3. Railway detecta el push, construye el contenedor Docker (stage `production`), y reemplaza el servidor en ~2–3 minutos
4. El sitio queda en la nueva versión con zero-downtime

---

## 8. Diseño y sistema de colores

| Token | Valor | Uso |
|-------|-------|-----|
| `bg` | `#0d0d0d` | Fondo principal (casi negro) |
| `surface` | `#1a1a1a` | Tarjetas, paneles |
| `border` | `#2a2a2a` | Bordes sutiles, separadores |
| `text` | `#f0ede8` | Texto principal (blanco cálido) |
| `muted` | `#8a8480` | Texto secundario, metadatos |
| `accent` | `#b07d4a` | Cobre/bronce — badges, CTAs, hover |
| `accent-hover` | `#c8914f` | Cobre más brillante para hover |

**Tipografía:**
- Headings: **Cormorant Garamond** (serif, pesos 300/400/600/700) — da el tono de galería de arte premium
- Body: **Inter** (sans-serif) — legible en pantallas pequeñas

**Clases de Tailwind personalizadas** (en lugar de colores hardcodeados):
```tsx
className="bg-bg text-text"          // fondo oscuro, texto claro
className="bg-surface border-border" // tarjeta
className="text-accent"              // cobre
className="bg-accent text-bg"        // botón relleno
```

---

## 9. Variables de entorno

Archivo: `.env` en la raíz del proyecto (no se sube a Git).

| Variable | Ejemplo | Descripción |
|----------|---------|-------------|
| `DATABASE_URI` | `postgresql://cristian:pass@db:5432/crovato` | Conexión a PostgreSQL |
| `PAYLOAD_SECRET` | `una-cadena-larga-y-aleatoria` | Firma de tokens de sesión del admin |
| `ARS_PER_USD` | `1160` | Tipo de cambio para mostrar precios duales (opcional) |

> En producción (Railway) estas variables se configuran en el dashboard de Railway — **no se suben al repositorio**.

---

## 10. Comandos útiles

```bash
# Desarrollo
docker-compose up -d                          # Iniciar todo
docker-compose down                           # Parar todo
docker-compose logs next --tail=50 -f         # Ver logs del servidor
docker-compose restart next                   # Reiniciar solo Next.js

# Rebuilds necesarios
docker-compose build --no-cache next          # Rebuild después de npm install
docker-compose down -v && docker-compose up -d # Reset total (borra datos locales)

# Base de datos (inspección directa)
docker exec cristiancrovato-db-1 psql -U cristian -d crovato -c "\dt"   # ver tablas
docker exec cristiancrovato-db-1 psql -U cristian -d crovato -c "SELECT title, status FROM works;" # ver obras
```

---

## 11. Estado actual y próximos pasos

### ✅ Hecho

- Scaffold completo: Next.js 15 + Payload CMS v3 + PostgreSQL
- Dos route groups: `(public)` y `(payload)` con layouts independientes
- Sistema de diseño (Tailwind, colores, tipografía)
- Navbar fija + Footer con links a todas las páginas
- `/` — homepage con hero y galería de obras destacadas
- `/obras` — galería responsiva con sidebar de perfil
- `/obras/[slug]` — detalle con galería de fotos, specs, "Otras obras" y CTA WhatsApp
- `/sobre-mi` — historia, proceso (5 etapas con fotos), cobertura en medios
- `/clientes` — grilla masonry de fotos de coleccionistas + stats + testimonial
- `/contacto` — perfil estilo ArtStation con links sociales y WhatsApp
- Colección Works con todos los campos (precios, materiales, dimensiones, SEO)
- Colección Media con 3 tamaños de imagen automáticos y acceso público
- Admin funcional en `/admin`
- Precios: ARS como precio principal, USD como referencia internacional
- WhatsApp: mensajes pre-cargados con el nombre de la obra
- Docker: hot reload en desarrollo, imagen standalone para producción
- Headers de seguridad HTTP (CSP, HSTS, X-Frame-Options, etc.)
- Favicon configurado vía `src/app/icon.jpg`
- `public/` limpio: solo archivos con nombres descriptivos y kebab-case

### 🔲 Pendiente (en orden de prioridad)

1. **Obras reales** — cargar las esculturas de Cristian en el admin (fotos, precios, descripciones)
2. **Dominio** — comprar y apuntar a Railway vía Cloudflare
3. **Deploy en Railway** — conectar repo GitHub → autodeploy
4. **Meta Pixel** — agregar el ID del pixel en `(public)/layout.tsx` cuando Cristian lo tenga
5. **Tests Playwright** — cubrir galería, detalle de obra y botón WhatsApp
6. **SMTP para reset de contraseña** — configurar en Payload para que Cristian pueda recuperar acceso solo
