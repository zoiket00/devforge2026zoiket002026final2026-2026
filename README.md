# DevForge Studio — Website v2.0

> Sitio web profesional para micro-estudio de desarrollo full-stack.  
> Stack 2026 · Claude AI Chatbot · Seguridad enterprise · 100% TypeScript

---

## Índice

1. [Vista general del proyecto](#1-vista-general-del-proyecto)
2. [Estructura de carpetas](#2-estructura-de-carpetas)
3. [Stack tecnológico](#3-stack-tecnológico)
4. [Instalación paso a paso](#4-instalación-paso-a-paso)
5. [Variables de entorno](#5-variables-de-entorno)
6. [Guía de cada componente](#6-guía-de-cada-componente)
7. [Chatbot con IA](#7-chatbot-con-ia)
8. [Sistema de seguridad](#8-sistema-de-seguridad)
9. [Personalización](#9-personalización)
10. [Deployment en Vercel](#10-deployment-en-vercel)
11. [Comandos disponibles](#11-comandos-disponibles)

---

## 1. Vista general del proyecto

DevForge Studio es un sitio web completo para una empresa de desarrollo de software. Incluye:

- **8 páginas** completamente funcionales
- **Chatbot con Claude AI** que responde preguntas en tiempo real con streaming
- **Sistema de seguridad** con 11 capas (rate limit, CSRF, sanitización, etc.)
- **Formulario de contacto** conectado a email y WhatsApp
- **Diseño dark mode** con animaciones Framer Motion
- **Totalmente tipado** en TypeScript

---

## 2. Estructura de carpetas

```
devforge-studio/
│
├── app/                        ← Páginas del sitio (Next.js App Router)
│   ├── layout.tsx              ← Layout raíz con Header, Footer y Chatbot
│   ├── page.tsx                ← Página de inicio
│   ├── globals.css             ← Estilos globales y variables CSS
│   ├── not-found.tsx           ← Página 404
│   │
│   ├── services/page.tsx       ← /services — Servicios y precios
│   ├── work/page.tsx           ← /work — Portafolio de proyectos
│   ├── stack/page.tsx          ← /stack — Tecnologías
│   ├── team/page.tsx           ← /team — Equipo
│   ├── contact/page.tsx        ← /contact — Formulario de contacto
│   ├── blog/page.tsx           ← /blog — Blog (próximamente)
│   │
│   └── api/                    ← Endpoints del servidor
│       ├── chat/route.ts       ← POST /api/chat — Claude AI streaming
│       ├── contact/route.ts    ← POST /api/contact — Formulario contacto
│       └── newsletter/route.ts ← POST /api/newsletter — Suscripción
│
├── components/                 ← Componentes reutilizables
│   ├── ui/                     ← Componentes base (design system)
│   │   ├── button.tsx          ← Botón con variantes
│   │   ├── card.tsx            ← Tarjeta contenedora
│   │   ├── input.tsx           ← Campo de entrada
│   │   ├── textarea.tsx        ← Área de texto
│   │   ├── select.tsx          ← Menú desplegable
│   │   ├── badge.tsx           ← Etiqueta pequeña
│   │   ├── label.tsx           ← Etiqueta de formulario
│   │   ├── separator.tsx       ← Línea divisora
│   │   ├── alert.tsx           ← Alerta / notificación
│   │   ├── tabs.tsx            ← Pestañas
│   │   ├── accordion.tsx       ← Acordeón expandible
│   │   ├── dialog.tsx          ← Modal
│   │   └── index.ts            ← Re-exportaciones
│   │
│   ├── layout/                 ← Estructura de la página
│   │   ├── header.tsx          ← Navegación principal
│   │   ├── footer.tsx          ← Pie de página
│   │   └── container.tsx       ← Contenedor responsivo
│   │
│   ├── sections/               ← Secciones grandes de página
│   │   ├── hero.tsx            ← Sección principal (arriba del todo)
│   │   ├── services.tsx        ← Grid de servicios
│   │   ├── projects.tsx        ← Portafolio de proyectos
│   │   ├── testimonials.tsx    ← Testimonios de clientes
│   │   ├── team.tsx            ← Equipo
│   │   ├── pricing.tsx         ← Tabla de precios
│   │   ├── stack.tsx           ← Stack tecnológico con tabs
│   │   ├── faq.tsx             ← Preguntas frecuentes
│   │   ├── cta.tsx             ← Llamada a la acción
│   │   └── index.ts            ← Re-exportaciones
│   │
│   ├── form/                   ← Formularios inteligentes
│   │   ├── contact-form.tsx    ← Form de contacto con validación
│   │   ├── newsletter-form.tsx ← Form de suscripción
│   │   └── index.ts
│   │
│   └── chatbot/
│       └── chatbot.tsx         ← Chatbot completo con IA
│
├── lib/                        ← Lógica de negocio y utilidades
│   ├── utils.ts                ← Funciones de utilidad (cn, formatDate, etc.)
│   ├── api.ts                  ← Cliente HTTP con manejo de errores
│   ├── validations.ts          ← Schemas de validación Zod
│   │
│   ├── security/               ← Sistema de seguridad
│   │   ├── headers.ts          ← CSP, HSTS, X-Frame-Options, etc.
│   │   ├── rate-limit.ts       ← Rate limiting por IP
│   │   ├── csrf.ts             ← Protección CSRF
│   │   ├── bot-detection.ts    ← Detección de bots maliciosos
│   │   ├── geo-block.ts        ← Bloqueo geográfico
│   │   ├── sanitizer.ts        ← Limpieza de inputs (XSS, SQLi)
│   │   ├── crypto.ts           ← Encriptación AES-256, hashing
│   │   ├── audit.ts            ← Logging de eventos de seguridad
│   │   └── env.ts              ← Validación de variables de entorno
│   │
│   └── chat/
│       └── knowledge-base.ts   ← Información del negocio para la IA
│
├── hooks/                      ← Custom React hooks
│   ├── index.ts                ← useScroll, useInView, useMediaQuery, etc.
│   └── use-chatbot.ts          ← Toda la lógica del chatbot
│
├── config/
│   └── site.ts                 ← Configuración global: nombre, URLs, nav
│
├── types/
│   └── index.ts                ← Tipos TypeScript del proyecto
│
├── middleware.ts               ← Seguridad global: intercepta TODAS las requests
│
├── public/                     ← Archivos estáticos (imágenes, iconos)
│   ├── robots.txt
│   └── images/
│
├── tests/                      ← Tests automatizados
│   ├── unit/                   ← Tests unitarios (Vitest)
│   └── e2e/                    ← Tests end-to-end (Playwright)
│
├── .github/workflows/ci.yml    ← Pipeline de CI/CD automático
├── .vscode/                    ← Configuración de VS Code
│   ├── settings.json
│   └── extensions.json
│
├── .env.example                ← Plantilla de variables de entorno
├── .env.local                  ← Tus variables REALES (no en git)
├── .eslintrc.json              ← Reglas de linting
├── .prettierrc.json            ← Formato de código
├── .gitignore                  ← Archivos que no se suben a git
├── next.config.ts              ← Configuración de Next.js
├── tailwind.config.ts          ← Configuración de Tailwind CSS
├── tsconfig.json               ← Configuración de TypeScript
├── postcss.config.mjs          ← Configuración de PostCSS
├── package.json                ← Dependencias del proyecto
└── README.md                   ← Este archivo
```

---

## 3. Stack tecnológico

| Categoría | Tecnología | Para qué sirve |
|-----------|-----------|----------------|
| Framework | Next.js 15 | Estructura del sitio (pages, API routes) |
| UI | React 19 | Componentes de interfaz |
| Lenguaje | TypeScript 5.7 | Tipos estrictos, menos errores |
| Estilos | Tailwind CSS 4 | Clases utilitarias |
| Animaciones | Framer Motion | Animaciones fluidas |
| Iconos | Lucide React | Iconos modernos |
| Forms | React Hook Form + Zod | Validación de formularios |
| IA | Claude (Anthropic) | Chatbot inteligente |
| Streaming | SSE (Server-Sent Events) | Chatbot en tiempo real |
| Seguridad | Custom security layer | 11 capas de protección |

---

## 4. Instalación paso a paso

### Prerrequisitos

Antes de empezar, necesitas instalar estas herramientas:

#### Paso 1 — Instalar Node.js

1. Ve a [nodejs.org](https://nodejs.org)
2. Descarga la versión **LTS** (la recomendada, versión 20 o superior)
3. Instala siguiendo el asistente
4. Verifica que funciona:

```bash
node --version
# Debe mostrar: v20.x.x o superior

npm --version
# Debe mostrar: 10.x.x o superior
```

#### Paso 2 — Instalar VS Code

1. Ve a [code.visualstudio.com](https://code.visualstudio.com)
2. Descarga e instala VS Code para tu sistema operativo
3. Ábrelo

#### Paso 3 — Instalar extensiones de VS Code

Abre VS Code y presiona `Ctrl+Shift+X` (o `Cmd+Shift+X` en Mac) para abrir el panel de extensiones.

Instala estas extensiones una por una buscándolas:

| Extensión | Para qué sirve |
|-----------|---------------|
| `Prettier - Code formatter` | Formatea el código automáticamente |
| `ESLint` | Detecta errores en el código |
| `Tailwind CSS IntelliSense` | Autocompletado de clases Tailwind |
| `TypeScript Vue Plugin` | Soporte mejorado TypeScript |
| `Auto Rename Tag` | Renombra etiquetas HTML automáticamente |
| `Path Intellisense` | Autocompletado de rutas de archivos |
| `DotENV` | Colorea archivos `.env` |
| `GitLens` | Herramientas avanzadas de Git |
| `Error Lens` | Muestra errores inline en el código |
| `Material Icon Theme` | Iconos bonitos para los archivos |

> **Atajo:** Cuando abras el proyecto en VS Code, aparecerá una notificación preguntando si quieres instalar las extensiones recomendadas. Haz clic en "Install All" y se instalan todas solas.

#### Paso 4 — Abrir el proyecto

1. Descomprime el archivo ZIP del proyecto
2. En VS Code: `Archivo > Abrir Carpeta` → selecciona la carpeta `devforge-studio`
3. Confía en el proyecto cuando VS Code lo pregunte

#### Paso 5 — Instalar dependencias

Abre la **Terminal** dentro de VS Code:
- Menú: `Terminal > Nueva Terminal`
- O atajo: `Ctrl+` ` ` (Ctrl + acento grave)

Ejecuta este comando:

```bash
npm install
```

Esto descarga todas las librerías del proyecto. Puede tardar 1-3 minutos. Verás muchas líneas de texto, es normal.

Cuando termine, verás algo como:
```
added 847 packages in 45s
```

#### Paso 6 — Configurar variables de entorno

Las variables de entorno son contraseñas y configuraciones privadas que **nunca** se suben a git.

1. En la raíz del proyecto, hay un archivo llamado `.env.example`
2. Cópialo y renómbralo a `.env.local`:

```bash
# En la terminal de VS Code:
cp .env.example .env.local
```

3. Abre `.env.local` en VS Code y rellena los valores (ver sección siguiente)

#### Paso 7 — Iniciar el servidor de desarrollo

```bash
npm run dev
```

Verás algo como:
```
▲ Next.js 15.1.3
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Starting...
✓ Ready in 1234ms
```

Abre tu navegador en **http://localhost:3000** — ¡el sitio está funcionando!

---

## 5. Variables de entorno

Abre el archivo `.env.local` que creaste y configura estos valores:

### Mínimo indispensable para arrancar

```bash
# URL de tu sitio
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Para el chatbot con IA (GRATIS en tier inicial)
# Consíguelo en: https://console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-api03-...

# Secretos de seguridad (genera uno para cada uno)
# Comando: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
CSRF_SECRET=pega-aqui-el-resultado-del-comando-anterior
JWT_SECRET=pega-aqui-otro-resultado-diferente
ENCRYPTION_KEY=pega-aqui-otro-resultado-diferente
```

### Cómo generar los secretos

En la terminal de VS Code escribe este comando (cada vez que lo ejecutes genera uno diferente):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copia el resultado y pégalo como valor de `CSRF_SECRET`. Repite para los otros dos.

### Para recibir emails del formulario de contacto

**Opción A — Resend (recomendado, plan gratuito disponible):**
1. Ve a [resend.com](https://resend.com) y crea cuenta gratis
2. En el dashboard, crea una API Key
3. Agrega al `.env.local`:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_EMAIL=tu@email.com
```

**Opción B — Gmail SMTP:**
1. Activa "Acceso de aplicaciones menos seguras" en tu cuenta Gmail
2. O mejor: crea una "Contraseña de aplicación" en la configuración de seguridad de Google
3. Agrega al `.env.local`:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu@gmail.com
SMTP_PASS=la-contraseña-de-aplicacion
SMTP_FROM=tu@gmail.com
CONTACT_EMAIL=donde-quieres-recibir@email.com
```

### Para contacto por WhatsApp

```bash
WHATSAPP_NUMBER=573001234567
# Formato: código de país + número sin espacios ni +
# Colombia (+57): 573001234567
```

---

## 6. Guía de cada componente

### Cómo cambiar los textos del hero (página principal)

Abre `app/page.tsx` y busca la sección Hero:

```tsx
<Hero
  badge="🚀 Powered by 2026 Tech Stack"     // ← Cambia esto
  title="Código que funciona."               // ← Y esto
  description="Tu descripción aquí..."       // ← Y esto
  cta={{ text: "Iniciar proyecto", href: "/contact" }}
/>
```

### Cómo agregar un proyecto al portafolio

En `app/work/page.tsx`, agrega un objeto al array `projects`:

```tsx
const projects = [
  {
    id: "mi-proyecto",              // ID único
    title: "Nombre del Proyecto",
    description: "Descripción breve del proyecto",
    image: "/images/mi-proyecto.png",  // Imagen en /public/images/
    technologies: ["React", "Node.js", "PostgreSQL"],
    featured: true,                 // true = aparece en el inicio
    status: "Live",                 // "Live" | "In Development" | "Archived"
    category: "Web",                // "Web" | "Mobile" | "AI" | "DevOps"
    link: "https://mi-proyecto.com",
    github: "https://github.com/...",
  },
  // ... más proyectos
];
```

### Cómo cambiar la información de contacto

Abre `config/site.ts`:

```ts
export const siteConfig = {
  name: "DevForge",              // ← Nombre de tu empresa
  description: "Tu descripción",
  links: {
    whatsapp: "https://wa.me/573001234567",  // ← Tu número
    email: "hola@tudominio.com",             // ← Tu email
    github: "https://github.com/tuusuario",
    linkedin: "https://linkedin.com/company/tu-empresa",
  },
};
```

### Cómo cambiar los precios

En `app/services/page.tsx` modifica el array `pricingTiers`:

```tsx
const pricingTiers = [
  {
    id: "starter",
    name: "Starter",
    price: 1500,     // ← Precio en USD
    ...
  },
];
```

### Cómo agregar miembros al equipo

En `app/team/page.tsx` agrega al array `members`:

```tsx
{
  id: "nuevo-miembro",
  name: "Ana García",
  role: "Frontend Developer",
  image: "/images/ana.jpg",         // Foto en /public/images/
  bio: "Descripción de Ana...",
  skills: ["React", "CSS", "Figma"],
  social: {
    github: "https://github.com/ana",
    linkedin: "https://linkedin.com/in/ana",
  },
},
```

---

## 7. Chatbot con IA

El chatbot usa **Claude de Anthropic** con streaming en tiempo real.

### Cómo funciona

1. El usuario escribe en el chat → va a `/api/chat`
2. La API valida y sanitiza el mensaje
3. Se envía a Claude con el contexto de tu negocio
4. Claude responde y los tokens llegan en tiempo real (streaming)
5. El bot muestra respuestas contextuales y quick replies

### Personalizar las respuestas del bot

Abre `lib/chat/knowledge-base.ts` y edita `SYSTEM_PROMPT`:

```ts
export const SYSTEM_PROMPT = `
Eres el asistente de TU EMPRESA AQUÍ...

## TUS SERVICIOS
- Servicio A: desde $X USD...

## TU CONTACTO
- WhatsApp: +57...
...
`;
```

Mientras más información incluyas aquí, mejor responde el bot.

### El bot activa automáticamente

- **A los 30 segundos** de que el usuario llega a la página, aparece solo con un mensaje proactivo
- **Badge rojo** muestra cuántos mensajes no leídos hay
- **Lead capture** aparece cuando detecta intención de compra
- **Handoff a WhatsApp** cuando el usuario escribe "hablar con humano"

---

## 8. Sistema de seguridad

El proyecto incluye 11 capas de seguridad activas por defecto:

| Capa | Archivo | Protección |
|------|---------|------------|
| Middleware | `middleware.ts` | Intercepta 100% de requests |
| Rate Limit | `lib/security/rate-limit.ts` | Bloquea abuso por IP |
| CSRF | `lib/security/csrf.ts` | Previene ataques cross-site |
| Bot Detection | `lib/security/bot-detection.ts` | Bloquea 30+ scanners maliciosos |
| Sanitización | `lib/security/sanitizer.ts` | Limpia XSS y SQL injection |
| Headers HTTP | `lib/security/headers.ts` | CSP, HSTS, X-Frame-Options |
| Encriptación | `lib/security/crypto.ts` | AES-256-GCM para datos sensibles |
| Audit Log | `lib/security/audit.ts` | Registro de eventos de seguridad |
| Env Validation | `lib/security/env.ts` | Verifica variables de entorno |
| Geo Block | `lib/security/geo-block.ts` | Bloqueo por país (configurable) |
| .gitignore | `.gitignore` | Protege secretos del repositorio |

No necesitas configurar nada — todo funciona automáticamente.

---

## 9. Personalización

### Cambiar los colores del sitio

Abre `app/globals.css` y edita las variables CSS:

```css
:root {
  /* Color de acento (verde por defecto) */
  --color-accent: 160 100% 50%;

  /* Prueba otros colores: */
  /* Azul:   210 100% 56%  */
  /* Morado: 260 80%  68%  */
  /* Naranja: 30 100% 50%  */
}
```

El número representa: **matiz grados / saturación % / luminosidad %**

### Cambiar las fuentes

En `tailwind.config.ts`:

```ts
fontFamily: {
  mono: ["Tu Fuente Mono", "monospace"],
  display: ["Tu Fuente Display", "sans-serif"],
  body: ["Tu Fuente Cuerpo", "sans-serif"],
},
```

Y en `app/globals.css` cambia el import de Google Fonts.

### Cambiar el nombre de la empresa

1. `config/site.ts` → campo `name`
2. `lib/chat/knowledge-base.ts` → `SYSTEM_PROMPT` (menciona el nombre varias veces)
3. `components/layout/header.tsx` → el logo
4. `components/layout/footer.tsx` → el footer

---

## 10. Deployment en Vercel

Vercel es la plataforma recomendada para Next.js (gratis para proyectos personales).

### Paso 1 — Crear cuenta en Vercel

Ve a [vercel.com](https://vercel.com) y crea una cuenta (gratis con GitHub).

### Paso 2 — Subir código a GitHub

```bash
# En la terminal de VS Code:
git init
git add .
git commit -m "Initial commit"

# Crea un repositorio en github.com y sigue las instrucciones
git remote add origin https://github.com/tu-usuario/devforge.git
git push -u origin main
```

### Paso 3 — Conectar Vercel con GitHub

1. En Vercel: "New Project"
2. Importa tu repositorio de GitHub
3. Vercel detecta automáticamente que es Next.js

### Paso 4 — Configurar variables de entorno en Vercel

En el dashboard de Vercel → Settings → Environment Variables:

Agrega **todas** las variables de tu `.env.local` (excepto `NEXT_PUBLIC_SITE_URL` que debes cambiar a tu dominio real):

```
NEXT_PUBLIC_SITE_URL = https://tudominio.com
ANTHROPIC_API_KEY = sk-ant-api03-...
CSRF_SECRET = tu-secret-generado
JWT_SECRET = tu-secret-generado
ENCRYPTION_KEY = tu-secret-generado
RESEND_API_KEY = re_...
CONTACT_EMAIL = hola@tudominio.com
```

### Paso 5 — Deploy

Haz clic en "Deploy". Vercel construye y despliega automáticamente.

Cada vez que hagas `git push`, Vercel actualiza el sitio solo.

---

## 11. Comandos disponibles

Todos se ejecutan en la terminal de VS Code:

```bash
# Iniciar servidor de desarrollo (usa esto para trabajar)
npm run dev

# Verificar que no hay errores de TypeScript
npm run type-check

# Revisar el código con ESLint
npm run lint

# Corregir errores automáticamente
npm run lint:fix

# Formatear todo el código con Prettier
npm run format

# Construir para producción (igual que Vercel)
npm run build

# Iniciar el servidor de producción (después de build)
npm run start

# Ejecutar tests
npm run test
```

---

## Resolución de problemas comunes

### Error: "Cannot find module"

```bash
# Borra node_modules y reinstala
rm -rf node_modules
npm install
```

### Error en el chatbot: "API Key invalid"

Verifica que `ANTHROPIC_API_KEY` en `.env.local` es correcta y empieza por `sk-ant-`.  
Reinicia el servidor después de cambiar `.env.local`: `Ctrl+C` y vuelve a ejecutar `npm run dev`.

### El sitio no carga en localhost:3000

Verifica que el puerto no está ocupado:
```bash
# Usa otro puerto
npm run dev -- --port 3001
```

### Los estilos no se actualizan

```bash
# Reinicia el servidor
Ctrl+C
npm run dev
```

### Error "Module not found: @/components/..."

Verifica que `tsconfig.json` tiene configurado el path alias `@/*`:
```json
"paths": { "@/*": ["./*"] }
```

---

## Contacto y soporte

**DevForge Studio**  
📧 hola@devforge.dev  
💬 [WhatsApp](https://wa.me/573001234567)  
📅 [Agendar llamada](https://cal.com/devforge)  
🌐 Cartagena, Colombia

---

*Construido con Next.js 15 · React 19 · TypeScript · Tailwind CSS · Claude AI*
