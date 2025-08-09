La "Ujier App" es una aplicación web diseñada para ayudar a las iglesias a gestionar y registrar la asistencia a sus servicios y eventos. Su objetivo principal es simplificar el proceso de conteo de asistentes, la gestión de miembros y simpatizantes, y el seguimiento del historial de asistencia, todo ello con una interfaz intuitiva y accesible.

**Funcionalidades Clave:**

1. **Conteo de Asistencia (Conteo):**

1. Permite a los ujieres registrar el número de hermanos, hermanas, niños y adolescentes presentes en un servicio.
2. Incluye contadores incrementales y decrementales para facilitar el registro.
3. Permite seleccionar la fecha del servicio y el tipo de servicio (Dominical, Oración y Enseñanza, Hermanas Dorcas, Evangelismo, Jóvenes, Otro).
4. Permite seleccionar el ujier responsable del conteo o introducir un nombre personalizado.
5. Ofrece un "Modo Consecutivo" para mantener el conteo base del servicio anterior, útil para eventos de varios días o sesiones.
6. Permite añadir simpatizantes y miembros específicos que asisten al servicio, ya sean existentes o nuevos.



2. **Gestión de Simpatizantes:**

1. Mantiene una lista de personas que han visitado la iglesia pero no son miembros formales.
2. Permite añadir nuevos simpatizantes con su nombre, teléfono, dirección y notas.
3. Permite buscar y seleccionar simpatizantes existentes para incluirlos en el conteo del día.
4. Ofrece una pantalla de detalles para ver y actualizar la información de cada simpatizante.



3. **Gestión de Miembros:**

1. Mantiene una lista de los miembros registrados de la iglesia.
2. Permite añadir nuevos miembros con su información (nombre, teléfono, categoría, etc.).
3. Permite buscar y seleccionar miembros existentes para incluirlos en el conteo del día (separados por hermanos, hermanas, niños, adolescentes).
4. Ofrece una pantalla de detalles para ver y actualizar la información de cada miembro.



4. **Historial de Asistencia:**

1. Registra todos los conteos de asistencia guardados, permitiendo revisar datos históricos.
2. Muestra un resumen de la asistencia por fecha, tipo de servicio y ujier.



5. **Gestión de Usuarios (Ujieres):**

1. Permite a los administradores gestionar los usuarios de la aplicación (ujieres, directiva, administradores).
2. Permite añadir, actualizar y desactivar cuentas de usuario.



6. **Roles de Usuario y Permisos:**

1. **Administrador (admin):** Acceso completo a todas las funcionalidades, incluyendo gestión de miembros y usuarios.
2. **Directiva:** Acceso a la mayoría de las funcionalidades, excepto la gestión de miembros.
3. **Ujier:** Acceso limitado principalmente a las pantallas de Conteo y Simpatizantes.



7. **Sincronización de Datos:**

1. Utiliza **Firebase Firestore** como base de datos en la nube para almacenar y sincronizar los datos.
2. Soporta un modo offline que guarda los datos localmente en el navegador y los sincroniza automáticamente cuando la conexión a internet se restablece.
3. Muestra un indicador visual del estado de la conexión (online/sincronizado, offline, error de sincronización).





**Tecnologías Utilizadas:**

- **Next.js (App Router):** Framework de React para construir la aplicación web.
- **React:** Biblioteca para la interfaz de usuario.
- **Firebase (Firestore):** Base de datos NoSQL en la nube para el almacenamiento y sincronización de datos.
- **Tailwind CSS:** Framework CSS para el diseño y estilizado rápido y responsivo.
- **shadcn/ui:** Componentes de interfaz de usuario pre-estilizados con Tailwind CSS para una apariencia moderna y consistente.
- **Lucide React:** Biblioteca de iconos.
- **date-fns:** Utilidad para el manejo de fechas.


En resumen, la "Ujier App" es una solución robusta y fácil de usar para la gestión de la asistencia y los datos de la congregación, diseñada para ser eficiente tanto en línea como fuera de línea.
