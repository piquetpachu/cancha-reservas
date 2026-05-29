# Documentación Completa del Proyecto de Reservas de Canchas y Torneos

## Introducción

Este documento explica en detalle toda la estructura, funcionalidades, arquitectura, componentes y lógica implementada hasta el momento en el proyecto de reservas de canchas y torneos.

El objetivo principal del sistema es permitir:

- Registro de usuarios
    
- Gestión de perfiles
    
- Reserva de canchas
    
- Gestión de clubes
    
- Administración de horarios
    
- Gestión de bloqueos
    
- Gestión de torneos
    
- Inscripción de usuarios en torneos
    
- Visualización de brackets y partidos
    
- Paneles separados según roles
    

Tecnologías utilizadas:

- React + Vite
    
- Supabase
    
- PostgreSQL
    
- TailwindCSS
    
- React Router DOM
    
- Lucide React
    

---

# Arquitectura General del Proyecto

La aplicación está organizada principalmente en:

```txt
src/
 ├── components/
 ├── layouts/
 ├── pages/
 ├── services/
 ├── supabaseClient.js
 └── App.jsx
```

---

# Sistema de Roles

Actualmente el sistema trabaja con tres roles:

## Cliente

Puede:

- Reservar canchas
    
- Inscribirse en torneos
    
- Editar su perfil
    
- Cancelar reservas
    

## Dueño

Puede:

- Crear clubes
    
- Crear canchas
    
- Crear torneos
    
- Administrar participantes
    
- Crear partidos
    
- Gestionar horarios
    
- Gestionar bloqueos
    

## Admin

Puede:

- Administrar usuarios
    
- Administrar clubes
    
- Administrar reservas
    
- Ver estadísticas
    
- Aprobar solicitudes de dueños
    

---

# Base de Datos en Supabase

## Tabla: profiles

Guarda información de usuarios.

Campos importantes:

```sql
id
nombre
telefono
email
rol
avatar_url
dni
fecha_nacimiento
```

Funciones:

- Datos del perfil
    
- Avatar del usuario
    
- Rol del usuario
    
- Información para torneos
    

---

## Tabla: clubs

Representa clubes deportivos.

Campos:

```sql
id
nombre
direccion
owner_id
foto
descripcion
habilitacion
```

---

## Tabla: canchas

Representa las canchas.

Campos:

```sql
id
nombre
club_id
deporte
precio_por_hora
descripcion
foto
habilitacion
```

---

## Tabla: reservas

Representa reservas de canchas.

Campos:

```sql
id
cancha_id
usuario_id
fecha
hora_inicio
hora_fin
estado
```

Estados utilizados:

```txt
pendiente
confirmada
cancelada
```

---

## Tabla: horarios_cancha

Define horarios disponibles.

---

## Tabla: bloqueos_horarios

Permite bloquear horarios.

Ejemplos:

- mantenimiento
    
- torneo
    
- lluvia
    

---

# Sistema de Torneos

Se agregó un sistema completo de torneos.

---

# Nuevas Tablas Agregadas

## Tabla: torneos

Representa torneos creados por dueños.

Campos:

```sql
id
nombre
descripcion
imagen_url
club_id
cancha_id
creado_por
fecha_inicio
fecha_fin
cupo_maximo
estado
created_at
```

Funciones:

- Crear torneo
    
- Mostrar información
    
- Mostrar imagen
    
- Relacionar torneo con cancha
    
- Relacionar torneo con club
    

---

## Tabla: inscripciones_torneo

Representa participantes.

Campos:

```sql
id
torneo_id
usuario_id
estado
created_at
```

Estados:

```txt
pendiente
aprobado
rechazado
```

Funciones:

- Inscribirse
    
- Aprobar participantes
    
- Rechazar participantes
    
- Mostrar participantes
    

---

## Tabla: partidos_torneo

Representa partidos del torneo.

Campos:

```sql
id
torneo_id
jugador1_id
jugador2_id
ganador_id
fecha
estado
ronda
```

Funciones:

- Crear partidos
    
- Definir rondas
    
- Definir ganador
    
- Mostrar bracket
    

---

# Políticas RLS

Se implementaron políticas RLS para seguridad.

---

## RLS para torneos

Permite:

- Leer torneos públicamente
    
- Crear torneos a dueños/admin
    
- Editar torneos al creador
    
- Eliminar torneos al creador
    

---

## RLS para inscripciones

Permite:

- Usuarios autenticados inscribirse
    
- Ver participantes
    
- Dueños administrar participantes
    

---

## RLS para reservas

Permite:

- Usuarios crear reservas
    
- Usuarios cancelar sus reservas
    

Ejemplo:

```sql
create policy "Usuarios cancelan sus reservas"
on reservas
for update
to authenticated
using (
  auth.uid() = usuario_id
)
with check (
  auth.uid() = usuario_id
);
```

---

# Estructura de Pages

## src/pages/torneos/

Se creó una carpeta exclusiva para torneos.

Esto mejora:

- organización
    
- escalabilidad
    
- mantenimiento
    
- separación lógica
    

---

# Archivos de Torneos

## Torneos.jsx

Ruta:

```txt
src/pages/torneos/Torneos.jsx
```

Función:

- Mostrar lista de torneos
    
- Mostrar cards de torneos
    
- Navegar al detalle
    

---

## TorneoDetalle.jsx

Ruta:

```txt
src/pages/torneos/TorneoDetalle.jsx
```

Es la página principal del torneo.

Funciones:

- Mostrar banner
    
- Mostrar descripción
    
- Mostrar tabs
    
- Mostrar participantes
    
- Mostrar partidos
    
- Mostrar bracket
    
- Administrar torneo
    

Tabs implementados:

```txt
Información
Participantes
Partidos
Bracket
Administración
```

También:

- permite editar
    
- permite eliminar
    
- permite inscribirse
    

---

## CrearTorneo.jsx

Ruta:

```txt
src/pages/torneos/CrearTorneo.jsx
```

Funciones:

- Mostrar formulario
    
- Crear torneo
    
- Navegar al detalle
    

Utiliza:

```txt
TournamentForm
```

---

## EditarTorneo.jsx

Permite editar torneos.

---

## DashboardTorneos.jsx

Panel del dueño.

Funciones:

- listar torneos creados
    
- administrar torneos
    

---

# Componentes de Torneos

## TournamentForm.jsx

Ruta:

```txt
src/components/torneos/TournamentForm.jsx
```

Funciones:

- Inputs del torneo
    
- Imagen
    
- Cupos
    
- Fechas
    
- Descripción
    

---

## TournamentJoinButton.jsx

Funciones:

- Inscribirse al torneo
    
- Verificar usuario
    
- Insertar inscripción
    

---

## TournamentParticipants.jsx

Funciones:

- Mostrar participantes
    
- Mostrar avatar
    
- Mostrar estado
    

Se rediseñó para:

- modo oscuro
    
- diseño horizontal
    
- avatares pequeños
    
- grid responsive
    

---

## TournamentParticipantsAdmin.jsx

Funciones:

- Aprobar participantes
    
- Rechazar participantes
    
- Administrar cupos
    

---

## TournamentMatches.jsx

Funciones:

- Mostrar partidos
    
- Mostrar rondas
    
- Mostrar ganadores
    

---

## CreateMatchForm.jsx

Funciones:

- Crear partido manualmente
    
- Elegir participantes
    
- Elegir ronda
    

---

## TournamentBracket.jsx

Funciones:

- Mostrar bracket visual
    
- Organizar rondas
    
- Mostrar ganadores
    

---

# Sistema de UI

Se creó un mini design system.

---

## Card.jsx

Componente reutilizable.

Usado para:

- perfiles
    
- reservas
    
- torneos
    
- dashboards
    

---

## Button.jsx

Sistema de botones reutilizables.

Variantes:

```txt
primary
secondary
danger
success
```

---

## Input.jsx

Inputs estilizados.

---

## Badge.jsx

Usado para:

- estados
    
- roles
    
- etiquetas
    

---

## Tabs.jsx

Sistema de tabs reutilizable.

Usado en:

- torneos
    
- perfil
    

---

# Sistema de Layouts

Se reorganizó App.jsx usando layouts.

---

## DashboardLayout.jsx

Contiene:

- Sidebar
    
- Navbar
    
- Outlet
    

Funciones:

- estructura global
    
- diseño consistente
    

---

## Sidebar.jsx

Nuevo sistema de navegación.

Mejoras:

- modo oscuro
    
- navegación moderna
    
- íconos
    
- responsive
    

---

# Lucide React

Se incorporó:

```bash
npm install lucide-react
```

Para usar íconos modernos.

Ejemplo:

```jsx
import {
  Home,
  Trophy,
  User
} from 'lucide-react'
```

---

# TailwindCSS

Se migró gran parte del sistema visual a Tailwind.

Ventajas:

- rapidez
    
- diseño consistente
    
- responsive
    
- reutilización
    

Ejemplo:

```jsx
className="
  bg-[#131A2E]
  rounded-2xl
  p-6
  shadow-lg
"
```

---

# Sistema de Perfil

## Profile.jsx

Fue completamente rehecho.

Funciones:

- editar perfil
    
- subir avatar
    
- tabs
    
- reservas
    
- torneos
    
- solicitud de dueño
    

Nuevos campos:

```txt
DNI
Fecha nacimiento
```

---

# Sistema de Reservas

## Mejoras implementadas

- reservas reales
    
- cancelación
    
- badges visuales
    
- cards modernas
    

---

## Cancelación de reservas

Archivo:

```txt
src/services/reservaService.js
```

Función:

```javascript
cancelarReserva()
```

Actualiza:

```txt
estado = cancelada
```

---

# Storage de Supabase

Se implementó subida de imágenes.

Buckets utilizados:

```txt
avatars
torneos
```

---

# Upload de Avatares

Implementado en:

```txt
Profile.jsx
```

Funciones:

- subir imagen
    
- obtener URL pública
    
- actualizar profile
    

---

# Upload de Imágenes de Torneos

Implementado para:

- banners
    
- cards
    
- detalles
    

---

# React Router

Se reorganizó App.jsx.

Rutas importantes:

```jsx
/torneos
/torneos/:id
/dashboard/torneos
/dashboard/torneos/nuevo
/dashboard/torneos/:id/editar
```

---

# Problemas Solucionados

## Error: inscripciones_torneo no existe

Causa:

- tabla faltante en Supabase
    

Solución:

- crear tabla
    
- refrescar schema cache
    

---

## Error: Cannot coerce the result to a single JSON object

Causa:

- uso incorrecto de `.single()`
    

Solución:

- eliminar `.single()` en consultas múltiples
    

---

## Problemas de estilos

Se detectó:

- componentes sin Tailwind
    
- estilos inconsistentes
    

Solución:

- crear design system
    
- componentes reutilizables
    
- layouts globales
    

---

# Estado Actual del Proyecto

Actualmente el sistema ya posee:

## Sistema de usuarios

- login
    
- perfil
    
- avatar
    
- roles
    

## Sistema de clubes

- creación
    
- administración
    

## Sistema de canchas

- creación
    
- horarios
    
- bloqueos
    

## Sistema de reservas

- reservas reales
    
- cancelación
    

## Sistema de torneos

- crear torneo
    
- editar torneo
    
- eliminar torneo
    
- participantes
    
- partidos
    
- bracket
    
- administración
    

## Sistema visual

- layouts
    
- sidebar
    
- tabs
    
- cards
    
- badges
    
- responsive
    

---

# Próximos Pasos Recomendados

## 1. Mejorar diseño responsive

Especialmente:

- móviles
    
- tablets
    

---

## 2. Sistema automático de brackets

Actualmente muchos partidos son manuales.

Se recomienda:

- generación automática
    
- eliminación directa
    
- rondas automáticas
    

---

## 3. Sistema de pagos

Integrar:

- Mercado Pago
    
- pagos por reservas
    
- pagos por torneos
    

---

## 4. Notificaciones

Agregar:

- emails
    
- notificaciones push
    
- avisos de partidos
    

---

## 5. Chat interno

Posible sistema:

- chat de torneo
    
- chat de reservas
    

---

## 6. Estadísticas avanzadas

Para dueños:

- ganancias
    
- reservas
    
- ocupación
    
- torneos más populares
    

---

# Conclusión

El proyecto ya tiene una base muy sólida.

Actualmente posee:

- arquitectura escalable
    
- separación por componentes
    
- sistema de roles
    
- sistema visual moderno
    
- backend funcional
    
- integración completa con Supabase
    

El módulo de torneos ya funciona como una característica real y escalable.

El siguiente gran salto del proyecto probablemente sea:

- automatización avanzada
    
- pagos
    
- experiencia móvil
    
- mejoras visuales
    
- tiempo real