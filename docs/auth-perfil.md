
# 🏟️ Sistema de Autenticación y Perfil - App de Canchas

## 📌 Tecnologías utilizadas

- React (Vite)
- Supabase (Auth, Database, Storage)
- React Router DOM

---

## 🔐 Autenticación

Se implementó un sistema de autenticación usando **Supabase Auth** con:

- Email + contraseña
- Registro de usuarios
- Login
- Logout
- Persistencia de sesión

---

## 🧑‍💻 Registro de usuario

Al registrarse, el usuario ingresa:

- Email
- Contraseña
- Nombre
- Teléfono

### Flujo:

1. Se crea el usuario en `auth.users`
2. Se crea un perfil en la tabla `profiles` con:
   - id (igual al auth.users.id)
   - nombre
   - telefono
   - rol (por defecto: `cliente`)

---

## 🧾 Tabla `profiles`

Estructura:

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text,
  telefono text,
  rol text default 'cliente',
  avatar_url text,
  created_at timestamp default now()
);
🔐 Seguridad (RLS)

Se configuraron políticas (policies):

SELECT (ver perfil)
create policy "Users can see their profile"
on profiles
for select
using (auth.uid() = id);
INSERT (crear perfil)
create policy "Allow insert for authenticated users"
on profiles
for insert
to authenticated
with check (true);
UPDATE (editar perfil)
create policy "Users can update their profile"
on profiles
for update
using (auth.uid() = id);
👤 Página de Perfil

Ruta:

/profile
Funcionalidades:
Mostrar:
Email
Nombre
Teléfono
Foto de perfil
Subir imagen de perfil
Actualizar avatar
📸 Subida de imágenes

Se utiliza Supabase Storage

Bucket:
avatars
Flujo:
Usuario selecciona imagen
Se sube al bucket avatars
Se obtiene la URL pública
Se guarda en profiles.avatar_url
🔐 Policies en Storage
Subir archivos
create policy "Allow upload for authenticated users"
on storage.objects
for insert
to authenticated
with check (true);
Ver archivos
create policy "Public read access"
on storage.objects
for select
using (true);
🧭 Navegación

Se usa react-router-dom

Rutas principales:

/login → Login / Registro
/ → Dashboard
/profile → Perfil de usuario
🔘 Navegación a perfil

Desde el Dashboard:

navigate('/profile')
🧠 Decisiones de diseño
❌ No se pide foto en registro
Reduce fricción
Mejora UX
✅ Teléfono en profiles (no en auth)
Se usa solo como dato de contacto
No como método de login
❌ No se elige rol en registro
Evita problemas de seguridad
El rol se asigna manualmente o por admin
🚀 Estado actual del proyecto

✔ Autenticación completa
✔ Registro con datos adicionales
✔ Perfil funcional
✔ Subida de imagen
✔ Navegación entre vistas