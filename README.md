# 📊 Sistema de Conteo de Asistencia - Iglesia

Una aplicación web moderna y responsive para el conteo y gestión de asistencia en servicios religiosos, desarrollada con Next.js, React, TypeScript y Firebase.

## 🌟 Características Principales

### 👥 Sistema de Usuarios
- **Roles diferenciados**: Administradores y Ujieres
- **Autenticación segura** con contraseñas personalizadas
- **Gestión de usuarios** (solo para administradores)
- **Estados de usuario** (activo/inactivo)

### 📊 Conteo de Asistencia
- **Categorías múltiples**: Hermanos, Hermanas, Niños, Adolescentes, Simpatizantes
- **Conteo manual** con botones +/- y edición directa
- **Conteo múltiple** para agregar varias personas a la vez
- **Registro de asistentes** con nombres específicos
- **Modo consecutivo** para servicios dominicales después de evangelismo/misionero

### 📋 Gestión de Datos
- **Simpatizantes**: Registro completo con teléfono y notas
- **Miembros**: Gestión por categorías con información detallada
- **Historial completo** de todos los servicios
- **Sincronización automática** con Firebase

### 📈 Reportes y Análisis
- **Filtros avanzados** por fecha, servicio y ujier
- **Estadísticas detalladas** por categoría y período
- **Exportación múltiple**: CSV, Resumen y Detallado
- **Gráficos de tendencia** interactivos
- **Análisis de rendimiento** por ujier y servicio

### 🔄 Funcionalidades Avanzadas
- **Modo offline** con almacenamiento local
- **Sincronización automática** cuando hay conexión
- **Responsive design** optimizado para móviles
- **PWA ready** para instalación en dispositivos

## 🚀 Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI/UX**: Tailwind CSS, shadcn/ui components
- **Backend**: Firebase Firestore
- **Autenticación**: Firebase Auth (anónima)
- **Estado**: React Hooks + Context
- **Almacenamiento**: IndexedDB (localforage)
- **Iconos**: Lucide React

## 📱 Estructura de la Aplicación

\`\`\`
src/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Componente principal con routing
│   └── globals.css         # Estilos globales
├── components/
│   ├── ui/                 # Componentes base de shadcn/ui
│   ├── conteo-screen.tsx   # Pantalla de conteo
│   ├── historial-screen.tsx # Historial y reportes
│   ├── simpatizantes-screen.tsx # Gestión de simpatizantes
│   ├── miembros-screen.tsx # Gestión de miembros
│   ├── login-screen.tsx    # Autenticación
│   ├── dashboard-screen.tsx # Dashboard administrativo
│   ├── ujieres-screen.tsx  # Gestión de usuarios
│   ├── bottom-navigation.tsx # Navegación inferior
│   └── *-detail-screen.tsx # Pantallas de detalle
├── hooks/
│   └── use-data-sync.ts    # Hook de sincronización
└── lib/
    └── firebase.ts         # Configuración Firebase
\`\`\`

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Firebase

### 1. Clonar el repositorio
\`\`\`bash
git clone [URL_DEL_REPOSITORIO]
cd ujier-app
\`\`\`

### 2. Instalar dependencias
\`\`\`bash
npm install
# o
yarn install
\`\`\`

### 3. Configurar Firebase
1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar Firestore Database
3. Habilitar Authentication (método anónimo)
4. Copiar la configuración del proyecto

### 4. Variables de entorno
Crear archivo `.env.local` en la raíz del proyecto:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
\`\`\`

### 5. Ejecutar en desarrollo
\`\`\`bash
npm run dev
# o
yarn dev
\`\`\`

La aplicación estará disponible en `http://localhost:3000`

## 👤 Usuarios por Defecto

### Administrador Principal
- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Permisos**: Acceso completo a todas las funciones

### Ujieres del Sistema
La aplicación incluye usuarios predefinidos para todos los ujieres:
- **Patrón de contraseña**: `[primer_nombre].`
- **Ejemplo**: Wilmar Rojas → `wilmar.`

**Lista de Ujieres Incluidos:**
- Wilmar Rojas, Juan Caldera, Joaquin Velez, Yarissa Rojas
- Cristian Gomez, Hector Gaviria, Ivan Caro, Jhon echavarria
- Karen Cadavid, Carolina Monsalve, Marta Verona, Nicolas Gömez
- Oraliz Fernåndez, Santiago Graciano, Suri Vélez, Wilmar Vélez
- Diana Suarez, José perdomo, Carolina Caro, Jose Abeldaño
- Gilberto Castaño

## 📊 Tipos de Servicio

- **Dominical**: Servicio principal dominical
- **Oración y Enseñanza**: Servicio de oración entre semana
- **Hermanas Dorcas**: Servicio específico para hermanas
- **Evangelismo**: Servicio evangelístico
- **Misionero**: Servicio misionero
- **Jóvenes**: Servicio de jóvenes

## 🔄 Flujo de Trabajo

### Para Ujieres
1. **Login** con credenciales asignadas
2. **Conteo** de asistencia por categorías
3. **Agregar simpatizantes** con nombres específicos
4. **Guardar** el conteo del servicio

### Para Administradores
1. **Dashboard** con estadísticas generales
2. **Gestión completa** de usuarios, miembros y simpatizantes
3. **Reportes avanzados** con múltiples filtros
4. **Exportación** de datos en varios formatos
5. **Análisis de tendencias** y rendimiento

## 📱 Características Móviles

- **Diseño responsive** optimizado para teléfonos
- **Navegación táctil** intuitiva
- **Botones grandes** para facilitar el uso
- **Modo offline** para áreas con conectividad limitada
- **Sincronización automática** al recuperar conexión

## 🔒 Seguridad y Privacidad

- **Autenticación requerida** para acceso
- **Roles y permisos** diferenciados
- **Datos encriptados** en Firebase
- **Almacenamiento local seguro** con IndexedDB
- **Sin datos sensibles** en el código fuente

## 📈 Reportes Disponibles

### CSV Export
- Datos completos en formato tabular
- Compatible con Excel/Google Sheets
- Incluye nombres de asistentes

### Informe Resumen
- Estadísticas ejecutivas
- Rankings de servicios y ujieres
- Distribución porcentual

### Informe Detallado
- Análisis completo con todos los datos
- Desglose por registro individual
- Listas completas de asistentes
- Formato profesional para presentaciones

## 🛠️ Desarrollo y Contribución

### Scripts Disponibles
\`\`\`bash
npm run dev          # Desarrollo
npm run build        # Construcción para producción
npm run start        # Servidor de producción
npm run lint         # Linting del código
\`\`\`

### Estructura de Datos

#### Registro de Asistencia
\`\`\`typescript
{
  fecha: string
  servicio: string
  ujier: string[]
  hermanos: number
  hermanas: number
  ninos: number
  adolescentes: number
  simpatizantes: number
  total: number
  simpatizantesAsistieron: Array<{id: string, nombre: string}>
  miembrosAsistieron: {
    hermanos: Array<{id: string, nombre: string}>
    hermanas: Array<{id: string, nombre: string}>
    ninos: Array<{id: string, nombre: string}>
    adolescentes: Array<{id: string, nombre: string}>
  }
}
\`\`\`

## 🐛 Solución de Problemas

### Problemas Comunes

**Error de conexión a Firebase:**
- Verificar variables de entorno
- Comprobar configuración de Firebase
- Revisar reglas de Firestore

**Datos no se sincronizan:**
- Verificar conexión a internet
- Comprobar autenticación anónima
- Revisar consola del navegador

**Login no funciona:**
- Verificar credenciales
- Comprobar estado del usuario (activo/inactivo)
- Revisar lista de usuarios en Firebase

## 📞 Soporte

Para soporte técnico o consultas:
- Revisar la documentación
- Comprobar issues conocidos
- Contactar al administrador del sistema

## 📄 Licencia

Este proyecto está desarrollado específicamente para uso interno de la iglesia.

---

**Desarrollado con ❤️ para la gestión eficiente de la asistencia en servicios religiosos**
