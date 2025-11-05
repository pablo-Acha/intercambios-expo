# Intercambios - Aplicación Móvil de Intercambio de Productos Para la Universidad Privada Boliviana

Una aplicación móvil desarrollada con React Native y Expo que permite a los usuarios intercambiar productos de manera segura y eficiente. La aplicación incluye autenticación, sistema de chat, geolocalización y moderación de contenido.

## Características Principales

### Autenticación
- **Login tradicional**: Inicio de sesión con correo electrónico y contraseña
- **Login con Google**: Autenticación mediante cuenta de Google, esta funcion aun se encuentra en desarrollo, aun no implementada.
- **Registro de usuarios**: Creación de nuevas cuentas con validación
- **Gestión de sesión**: Persistencia de sesión y cierre seguro

### Gestión de Productos
- **Publicación de productos**: Creación de publicaciones con imágenes y detalles
- **Aprobación de productos**: Sistema de moderación para validar publicaciones
- **Búsqueda y filtrado**: Búsqueda avanzada por categorías y ubicación
- **Estado de productos**: Gestión de disponibilidad (disponible, reservado, vendido)
- **Geolocalización**: Integración de mapas para mostrar ubicación de productos

### Sistema de Chat
- **Chat en tiempo real**: Comunicación instantánea entre usuarios
- **Gestión de conversaciones**: Historial de chats y notificaciones
- **Interfaz intuitiva**: Diseño moderno y fácil de usar

### Mapas y Ubicación
- **Mapa interactivo**: Visualización de productos en mapa
- **Geolocalización en tiempo real**: Ubicación actual del usuario
- **Puntos de encuentro**: Definición de lugares para intercambios

### Personalización
- **Temas de color**: Soporte para temas claro y oscuro
- **Animaciones suaves**: Transiciones y efectos visuales

## Tecnologías Utilizadas

### Framework y Herramientas
- **React Native**: Framework principal para desarrollo móvil
- **Expo**: Plataforma de desarrollo y distribución
- **TypeScript**: Lenguaje de programación con tipado estático
- **Expo Router**: Sistema de navegación basado en archivos

### Backend y Base de Datos
- **Firebase**: Plataforma backend como servicio
- **Firebase Authentication**: Sistema de autenticación
- **Cloud Firestore**: Base de datos NoSQL en tiempo real
- **Firebase Storage**: Almacenamiento de archivos e imágenes

### Estado y Gestión de Datos
- **Zustand**: Gestión de estado global ligera y eficiente
- **Context API**: Gestión de estado para autenticación
- **React Hooks**: Gestión de estado local y efectos

### UI y Componentes
- **React Native Reanimated**: Animaciones de alto rendimiento
- **React Native Gesture Handler**: Gestos y interacciones táctiles
- **React Native Maps**: Integración de mapas de Google
- **Expo Location**: Servicios de geolocalización
- **Expo Image Picker**: Selección de imágenes desde galería

### Utilidades
- **Day.js**: Manipulación de fechas y horas
- **Expo Constants**: Acceso a constantes de la aplicación
- **Expo Linking**: Manejo de enlaces profundos

## Estructura del Proyecto

```
intercambios-expoLeonardo/
├── app/                          # Rutas de la aplicación (Expo Router)
│   ├── (drawer)/                 # Agrupación de rutas con drawer
│   │   ├── (tabs)/               # Agrupación de rutas con tabs
│   │   ├── _layout.tsx           # Layout del drawer
│   │   ├── about.tsx             # Página Acerca de
│   │   ├── chats.tsx             # Página de chats
│   │   ├── map/                  # Rutas del mapa
│   │   └── moderation/           # Panel de moderación
│   ├── chat/                     # Rutas de chat
│   │   └── [id].tsx              # Chat individual
│   ├── config/                   # Configuración
│   │   ├── firebase.ts           # Configuración de Firebase
│   │   └── googleAuth.ts         # Configuración de Google Auth
│   ├── context/                  # Contextos de React
│   │   ├── AuthContext.tsx       # Contexto de autenticación
│   │   └── ChatContext.tsx       # Contexto de chat
│   ├── login/                    # Rutas de login
│   ├── product/                  # Rutas de productos
│   │   └── [id].tsx              # Detalle de producto
│   ├── profile/                  # Rutas de perfil
│   └── register/                 # Rutas de registro
├── src/                          # Código fuente
│   ├── assets/                   # Recursos estáticos
│   ├── components/               # Componentes reutilizables
│   │   ├── ChatMessage.tsx       # Componente de mensaje
│   │   ├── FavoritoButton.tsx    # Botón de favorito
│   │   ├── FiltroPanel.tsx       # Panel de filtros
│   │   ├── location/             # Componentes de ubicación
│   │   └── market/               # Componentes del mercado
│   ├── hooks/                    # Hooks personalizados
│   │   └── useThemeColors.ts     # Hook para colores del tema
│   ├── services/                 # Servicios y APIs
│   │   ├── chatService.ts        # Servicio de chat
│   │   ├── cloudinary.ts         # Integración con Cloudinary
│   │   ├── locationService.ts    # Servicio de ubicación
│   │   ├── productService.ts     # Servicio de productos
│   │   ├── routeService.ts       # Servicio de rutas
│   │   └── userService.ts        # Servicio de usuarios
│   ├── store/                    # Estado global (Zustand)
│   │   ├── useMarketStore.ts     # Store del mercado
│   │   ├── useProfileStore.ts    # Store del perfil
│   │   └── useThemeStore.ts      # Store del tema
│   ├── theme/                    # Temas y estilos
│   │   └── colors.ts             # Paleta de colores
│   └── types/                    # Definiciones de tipos
│       ├── map.ts                # Tipos para mapas
│       ├── product.ts             # Tipos para productos
│       └── user.ts               # Tipos para usuarios
├── App.tsx                         # Componente principal
├── app.json                        # Configuración de Expo
├── package.json                    # Dependencias del proyecto
└── tsconfig.json                   # Configuración de TypeScript
```

## Instalación y Configuración

### Requisitos Previos
- Node.js (v16 o superior)
- yarn
- Expo CLI
- Cuenta de Firebase

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone [https://github.com/pablo-Acha/intercambios-expo.git]
cd intercambios-expoLeonardo
git checkout dev
```

2. **Instalar dependencias**
```
yarn install
```

3. **Configurar Firebase**
- Crear un proyecto en [Firebase Console](https://console.firebase.google.com/)
- Habilitar Authentication (Email/Password y Google)
- Habilitar Cloud Firestore
- Habilitar Firebase Storage
- Configurar las reglas de seguridad apropiadas

4. **Configurar variables de entorno**
Crear un archivo `.env` en la raíz del proyecto:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

6. **Iniciar el proyecto**
```
yarn start
```

## Configuración de Firebase

### Estructura de la Base de Datos

#### Colección: `users`
```javascript
{
  uid: "string",              // ID único del usuario
  email: "string",            // Correo electrónico
  username: "string",         // Nombre de usuario
  displayName: "string",      // Nombre para mostrar
  role: "user" | "admin",     // Rol del usuario
  createdAt: timestamp,      // Fecha de creación
  updatedAt: timestamp         // Última actualización
}
```

#### Colección: `products`
```javascript
{
  id: "string",               // ID del producto
  title: "string",            // Título del producto
  description: "string",      // Descripción detallada
  category: "string",        // Categoría del producto
  condition: "string",       // Estado del producto
  images: ["string"],        // URLs de las imágenes
  ownerId: "string",         // ID del propietario
  status: "pending" | "approved" | "rejected" | "available" | "reserved" | "sold",
  location: {                  // Ubicación geográfica
    latitude: number,
    longitude: number,
    address: "string",
    meetingPoint: "string"
  },
  createdAt: timestamp,        // Fecha de creación
  approvedAt: timestamp,      // Fecha de aprobación
  approvedBy: "string",        // ID del administrador que aprobó
  rejectedAt: timestamp,      // Fecha de rechazo
  rejectedBy: "string",       // ID del administrador que rechazó
  rejectedReason: "string"    // Razón del rechazo
}
```

#### Colección: `chats`
```javascript
{
  id: "string",               // ID del chat
  participants: ["string"],    // IDs de los participantes
  productId: "string",        // ID del producto relacionado
  lastMessage: {              // Último mensaje
    text: "string",
    senderId: "string",
    timestamp: timestamp
  },
  createdAt: timestamp,       // Fecha de creación
  updatedAt: timestamp         // Última actualización
}
```

#### Colección: `messages`
```javascript
{
  id: "string",               // ID del mensaje
  chatId: "string",          // ID del chat
  senderId: "string",       // ID del remitente
  text: "string",           // Contenido del mensaje
  timestamp: timestamp,       // Fecha y hora
  isRead: boolean            // Estado de lectura
}
```

## Guía de Estilos

### Colores Principales
```typescript
// src/theme/colors.ts
export const colors = {
  primary: '#3b82f6',      // Azul principal
  secondary: '#10b981',     // Verde secundario
  accent: '#f59e0b',        // Amarillo acento
  background: '#ffffff',    // Fondo blanco
  surface: '#f8fafc',       // Superficie gris claro
  text: '#1f2937',          // Texto principal
  textSecondary: '#6b7280',  // Texto secundario
  error: '#ef4444',         // Rojo de error
  success: '#10b981',       // Verde de éxito
  warning: '#f59e0b',       // Amarillo de advertencia
  border: '#e5e7eb',        // Color de bordes
  disabled: '#9ca3af'       // Color deshabilitado
};
```

### Tipografía
- **Títulos**: FontWeight 700, tamaños 24-32px
- **Subtítulos**: FontWeight 600, tamaños 18-20px
- **Texto normal**: FontWeight 400, tamaño 16px
- **Texto pequeño**: FontWeight 400, tamaño 14px

### Componentes UI
- **Botones primarios**: Fondo azul (#3b82f6), texto blanco, bordes redondeados
- **Botones secundarios**: Fondo transparente, borde azul, texto azul
- **Inputs**: Fondo gris claro (#f9fafb), borde gris (#d1d5db), bordes redondeados
- **Cards**: Sombra suave, bordes redondeados, fondo blanco

## Seguridad

### Reglas de Firebase Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para usuarios autenticados
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Reglas para productos
    match /products/{productId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.ownerId == request.auth.uid;
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.ownerId || 
         request.auth.token.role == 'admin');
      allow delete: if request.auth != null && 
        (request.auth.uid == resource.data.ownerId || 
         request.auth.token.role == 'admin');
    }
    
    // Reglas para chats
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
  }
}
```

### Firebase Storage
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{productId}/{imageName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.resource.size < 5 * 1024 * 1024 && // Máximo 5MB
        request.resource.contentType.matches('image/.*');
    }
  }
}
```

## Contribución

### Guía de Contribución

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b contribución`)
3. Commit tus cambios (`git commit -m 'Añadir descripción de los cambios'`)
4. Push a la rama (`git push origin contribución`)
5. Abrir un Pull Request

## Equipo de Desarrollo

- **Desarrollador Principal**: Leonardo Carrillo
- **Rol**: Full Stack Developer

- **Desarrollador Principal**: Pablo Acha
- **Rol**: Full Stack Developer


- **Desarrollador Principal**: Diego Gomez 
- **Rol**: Full Stack Developer

---

**Nota**: Este proyecto está en desarrollo activo. Por los que es necesario mantener actualizadas las dependencias.