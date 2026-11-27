# Plan: cuentas, roles, pedidos y cupones para IceCul

Estado: **propuesto** — pendiente de las decisiones de la sección 10.
Base actual: Angular 22 + Bootstrap 5.3, publicado en Firebase Hosting (`heladeria-1735d`).

---

## 1. Objetivo

Pasar de una web informativa (pedidos solo por WhatsApp, formularios en `localStorage`) a una web con:

- **Inicio de sesión con Google** en un clic, o con **correo y contraseña** para quien no tenga cuenta de Google.
- **Dos roles**: cliente y administrador.
- **Catálogo administrable**: el admin sube y edita helados y malteadas.
- **Pedidos desde la web** con historial para el cliente.
- **Cupón de bienvenida del 15 %** enviado por correo al registrarse.

## 2. Roles

| Rol | Puede |
|---|---|
| **Cliente** | Entrar con Google, completar su perfil, hacer pedidos, ver su historial y el estado de cada pedido, ver sus cupones |
| **Administrador** | Crear, editar, ocultar y ordenar productos (foto, precio, disponibilidad); gestionar el estado de los pedidos; ver clientes, cupones y mensajes de los formularios |

- Todo usuario nuevo es **cliente**.
- El rol de administrador se guarda como **custom claim** de Firebase Auth (`admin: true`), no en un campo que el navegador pueda escribir. El token lo firma Google, las reglas lo leen sin consultas extra y ningún cliente puede modificarlo.
- El campo `usuarios/{uid}.rol` existe solo para mostrar el rol en pantalla. **Nunca** se usa para autorizar.
- El primer administrador se asigna con un script local que usa el Admin SDK (`scripts/asignar-admin.ts <correo>`), ejecutado por el dueño con sus credenciales. Los siguientes los asigna un admin desde el panel, mediante una función invocable que verifica que quien la llama sea admin.
- Las cuentas de administrador deben entrar con Google y tener **verificación en dos pasos** activada en esa cuenta de Google.

## 3. Inicio de sesión

**Firebase Authentication con dos proveedores: Google y correo/contraseña.**

La página `/ingresar` muestra arriba el botón principal **“Continuar con Google”** y debajo la opción **“o usa tu correo”**, con las pestañas *Ingresar* y *Crear cuenta*.

### 3.1 Con Google (opción principal)

- El usuario pulsa el botón, elige su cuenta en la ventana de Google y ya está dentro, sin crear contraseña.
- El primer ingreso crea la cuenta automáticamente.
- Google ya garantiza que el correo es real (`emailVerified = true`), así que el cupón se puede usar de inmediato.
- Se usa `signInWithPopup`. Si el navegador bloquea la ventana emergente (pasa en algunos celulares), se usa `signInWithRedirect` como respaldo. Para que el respaldo funcione en Safari, `authDomain` debe apuntar al dominio de Hosting (`heladeria-1735d.web.app`) y ese dominio debe estar en *Dominios autorizados* de Authentication.

### 3.2 Con correo y contraseña (para quien no tiene Google)

- **Crear cuenta:** nombre, correo, contraseña (mínimo 8 caracteres) y confirmación.
- Al crearla se envía automáticamente un **correo de verificación** de Firebase con un enlace.
- Mientras no verifique, el usuario puede entrar, navegar y armar su carrito. Pero verá un aviso “Verifica tu correo para hacer pedidos y usar tu cupón”, con un botón para **reenviar** el correo.
- **Ingresar:** correo y contraseña. Los errores se muestran en español y sin revelar si el correo existe (“Correo o contraseña incorrectos”).
- **¿Olvidaste tu contraseña?** envía el correo de restablecimiento de Firebase.
- Firebase limita los intentos fallidos por su cuenta; además se activa la *protección contra enumeración de correos* en la consola.

### 3.3 Común a los dos

- Después del primer ingreso se pide **completar el perfil**: teléfono y dirección de entrega. Con Google, el nombre y la foto vienen de la cuenta; con correo, se usa el nombre del registro.
- Se activa **“Vincular cuentas con el mismo correo”** (una cuenta por correo electrónico). Así, si alguien se registró con correo y luego entra con Google usando ese mismo correo, sigue siendo **la misma cuenta**, con sus pedidos y su cupón, en vez de crearse una segunda.
- **Hacer pedidos y usar cupones exige `emailVerified = true`.** Con Google se cumple siempre; con correo, después de verificar. Lo comprueban tanto la web como la función `crearPedido`.

## 4. Tecnología

| Necesidad | Servicio |
|---|---|
| Inicio de sesión | Firebase Authentication (Google + correo/contraseña) |
| Base de datos | Cloud Firestore (reemplaza `localStorage`) |
| Fotos de productos | Firebase Storage |
| Lógica segura (precios, cupones) | Cloud Functions (TypeScript), validación con **zod** |
| Protección contra bots | **App Check** con reCAPTCHA Enterprise |
| Secretos (SMTP, etc.) | **Secret Manager** (`defineSecret`) |
| Correo de bienvenida | Extensión **Trigger Email** de Firebase + proveedor SMTP |
| Integración continua | GitHub Actions + *preview channels* de Hosting |
| Cliente web | SDK oficial `firebase` envuelto en servicios propios (no AngularFire, que suele ir atrasado frente a Angular) |
| Desarrollo local | Firebase Emulator Suite (Auth, Firestore, Functions, Storage) |

> ⚠️ Cloud Functions y la extensión de correo exigen el **plan Blaze** (pago por uso). Con este volumen normalmente se queda en la capa gratuita, pero pide una tarjeta. Configurar una **alerta de presupuesto** desde el primer día.

## 5. Modelo de datos (Firestore)

```
usuarios/{uid}
  nombre, correo, fotoUrl, telefono, direccion
  proveedor: 'google' | 'correo'
  rol: 'cliente' | 'admin'
  perfilCompleto: boolean
  creado, actualizado

productos/{id}
  nombre, descripcion, categoria: 'helado' | 'malteada'
  precio (COP, entero), imagenUrl
  disponible: boolean, orden: number
  creado, actualizado

pedidos/{id}
  uid, cliente { nombre, telefono, direccion }
  items: [{ productoId, nombre, precio, cantidad }]
  subtotal, descuento, total, cuponId?
  estado: 'pendiente' | 'preparando' | 'en_camino' | 'entregado' | 'cancelado'
  notas, historial: [{ estado, por, fecha }], creado, actualizado

cupones/{id}
  uid, codigo: 'BIENVENIDA15', porcentaje: 15
  usado: boolean, pedidoId?, vence, creado

mensajes/{id}
  tipo: 'inconveniente' | 'aspirante' | 'empleado'
  nombre, apellido, correo, telefono, detalle, uid?
  leido: boolean, creado

mail/{id}            ← lo consume la extensión Trigger Email
```

### Reglas de seguridad (resumen)

Principio: **todo está denegado por defecto** (`allow read, write: if false` al final) y cada permiso se abre explícitamente. `esAdmin()` = `request.auth.token.admin == true`.

- `usuarios/{uid}`:
  - el dueño lee el suyo y edita **solo** `nombre`, `telefono` y `direccion`, validados con `diff().affectedKeys().hasOnly([...])`, tipos y longitudes máximas;
  - no puede tocar `rol`, `correo`, `proveedor` ni `creado`;
  - el documento lo crea la función `alCrearUsuario`, no el navegador;
  - el admin lee todos.
- `productos`:
  - lectura pública solo si `disponible == true`; el admin lee todos;
  - solo el admin escribe, con validación de esquema: categoría permitida, precio entero entre 1 y 1.000.000, textos con longitud máxima.
- `pedidos`:
  - el cliente lee solo los suyos; las consultas deben filtrar por `uid == request.auth.uid`, porque si no, las reglas las rechazan;
  - **nadie los crea ni los modifica desde el navegador**: se crean con `crearPedido` y el estado se cambia con `cambiarEstadoPedido`;
  - `cambiarEstadoPedido` solo acepta transiciones válidas: `pendiente → preparando → en_camino → entregado`, y `cancelado` desde `pendiente` o `preparando`. El admin puede hacer cualquier transición válida; el cliente solo puede cancelar su propio pedido y únicamente si está en `pendiente`. Cada cambio queda registrado en `historial` (estado, quién y cuándo);
  - el admin lee todos.
- `cupones`: el cliente lee solo los suyos. Solo las funciones los crean o modifican.
- `mensajes`: los crea únicamente la función `enviarMensaje`, que valida y limita la frecuencia. Solo el admin lee y marca como `leido`.
- `mail`, `correosConCupon`, `limites`: sin acceso desde el navegador; solo las funciones (Admin SDK).
- Storage `productos/{archivo}`: lectura pública; escritura solo si `esAdmin()`, con `contentType` que coincida con `image/(jpeg|png|webp)` y menos de 2 MB. Todo lo demás, denegado.

## 6. Flujos

### 6.1 Primer ingreso y cupón

1. El cliente pulsa “Continuar con Google” o crea una cuenta con correo y contraseña.
2. La Cloud Function `alCrearUsuario`, que se dispara con el usuario nuevo de Auth (sirve para los dos proveedores), hace lo siguiente:
   - crea `usuarios/{uid}` con `rol: 'cliente'`;
   - **evita cupones repetidos**: normaliza el correo (minúsculas; en Gmail quita los puntos y lo que va después de `+`) y calcula su hash. Si ya existe `correosConCupon/{hash}`, no crea otro cupón. Así, borrar la cuenta y volver a crearla con el mismo correo, o usar alias, no da un segundo 15 %;
   - si no existía, en una transacción crea `cupones/{id}` (código `BIENVENIDA15`, 15 %, vence a los 30 días, decisión 10.5) y `correosConCupon/{hash}`;
   - escribe en `mail/` el correo de bienvenida. El nombre del usuario se **escapa** antes de meterlo en el HTML, para que nadie pueda inyectar enlaces o código en el correo.
   - Nota técnica: los disparadores de Auth no bloqueantes siguen existiendo solo en la API v1 (`firebase-functions/v1`, `auth.user().onCreate`). Se usa esa API para esta función y la v2 para las demás.
3. Con correo y contraseña, Firebase envía además el correo de verificación. El correo de bienvenida aclara: “verifica tu correo para usar tu cupón”.
4. La web lleva al cliente a “Completar perfil”, donde ingresa teléfono y dirección.

### 6.2 Pedido

1. El cliente agrega productos al carrito. El carrito vive en el navegador hasta confirmar.
2. En la confirmación ve el resumen y puede aplicar un cupón vigente.
3. La función invocable `crearPedido({ solicitudId, items, cuponId?, notas })`:
   - exige sesión, **App Check** válido, `emailVerified == true` y perfil completo;
   - valida la entrada con un esquema (zod): entre 1 y 20 líneas, cantidad de 1 a 20 por producto, notas de hasta 300 caracteres, sin campos extra;
   - toma los **precios reales** de `productos` e ignora los que envía el navegador. Rechaza los productos no disponibles;
   - es **idempotente**: `solicitudId` es un UUID que genera la web al abrir la confirmación y se usa como ID del pedido. Si el cliente pulsa dos veces o falla la red, no se crean dos pedidos ni se gasta dos veces el cupón;
   - en una **transacción**, verifica que el cupón sea del usuario, no esté usado ni vencido, calcula el descuento en pesos enteros (redondeo hacia abajo), crea el pedido y marca el cupón como usado;
   - limita la frecuencia a un máximo de 5 pedidos por usuario cada 10 minutos (`limites/{uid}`);
   - responde errores genéricos al navegador y deja el detalle en los logs.
4. La web muestra la confirmación y abre WhatsApp con el resumen, para que el negocio se entere al instante.
5. El admin cambia el estado y el cliente lo ve actualizado en “Mis pedidos”, en tiempo real.

### 6.3 Catálogo

- Helados y Malteadas se leen de `productos`, filtrados por categoría y disponibilidad.
- El admin puede crear, editar, subir una foto, marcar como disponible o no y cambiar el orden.
- Los 12 productos actuales se cargan como datos iniciales con un script de *seed*.

## 7. Páginas

```
Públicas   /  /helados  /malteadas  /contacto  /informacion  /info1 /info2 /info3
           /ingresar             (Google + pestañas Ingresar / Crear cuenta con correo)
           /recuperar-clave  /verificar-correo  /carrito  /privacidad
Cliente    /mi-cuenta            (perfil, eliminar mi cuenta)
           /mi-cuenta/completar  (primer ingreso)
           /mi-cuenta/pedidos  /mi-cuenta/pedidos/:id
           /mi-cuenta/cupones
Admin      /admin                (resumen: pedidos de hoy, pendientes)
           /admin/productos  /admin/productos/nuevo  /admin/productos/:id
           /admin/pedidos  /admin/pedidos/:id
           /admin/clientes  /admin/cupones  /admin/mensajes
```

- Hay guards para cuatro casos (los guards solo mejoran la experiencia; **la seguridad real la ponen las reglas y las funciones**):
  - `soloAutenticado`, para las rutas de cliente;
  - `soloAdmin`, para las rutas de admin;
  - `perfilCompleto`, que redirige a completar el perfil antes de pedir;
  - `correoVerificado`, que redirige a `/verificar-correo` antes de confirmar un pedido.
- Las zonas de cliente y admin se cargan de forma diferida (*lazy loading*).
- En el menú, sin sesión aparece “Ingresar”. Con sesión aparece la foto de Google con un menú: Mi cuenta, Mis pedidos, Cupones, Panel admin (solo admin) y Salir.

## 8. Estructura del proyecto

```
ProyectoP/
├─ docs/PLAN.md
├─ src/app/
│  ├─ core/
│  │  ├─ firebase.ts            inicialización y conexión a emuladores en desarrollo
│  │  ├─ auth.service.ts        sesión, usuario actual, rol (signals)
│  │  ├─ guards/                soloAutenticado, soloAdmin, perfilCompleto, correoVerificado
│  │  ├─ modelos/               Usuario, Producto, Pedido, Cupon, Mensaje
│  │  └─ datos/                 productos, pedidos, cupones, mensajes, usuarios (servicios)
│  ├─ shared/                   tarjeta de producto, tabla, estado vacío, cargando, avisos
│  ├─ publico/                  inicio, catálogo, contacto, información, formularios
│  ├─ auth/                     ingresar (Google + correo), recuperar clave, verificar correo
│  ├─ cliente/                  mi cuenta, completar perfil, pedidos, cupones, carrito
│  └─ admin/                    panel, productos, pedidos, clientes, cupones, mensajes
├─ functions/
│  ├─ src/  alCrearUsuario.ts  crearPedido.ts  cambiarEstadoPedido.ts  enviarMensaje.ts
│  │        asignarAdmin.ts  eliminarCuenta.ts  index.ts
│  └─ test/                     pruebas de las funciones contra emuladores
├─ shared-model/                tipos compartidos entre la web y las funciones
├─ tests/
│  ├─ reglas/                   pruebas de firestore.rules y storage.rules
│  └─ e2e/                      pruebas Playwright de los flujos completos
├─ scripts/  seed-productos.ts  asignar-admin.ts
├─ .github/workflows/  ci.yml  deploy.yml
├─ firestore.rules  storage.rules  firestore.indexes.json
└─ firebase.json               hosting (+ cabeceras de seguridad) + functions + emuladores
```

En la fase 1 se migra de `NgModule` a **componentes standalone**, el estándar actual de Angular.

## 9. Seguridad, privacidad y calidad

Cada punto tiene una forma de comprobarlo (columna **Verificación**). Una fase no se da por terminada si alguna de sus verificaciones falla.

### 9.1 Seguridad

| Control | Qué hace | Verificación |
|---|---|---|
| Reglas que niegan por defecto | Firestore y Storage solo permiten lo que está escrito explícitamente | Pruebas con `@firebase/rules-unit-testing` en el emulador: para cada colección, un caso que debe pasar y otro que debe fallar (anónimo, otro cliente, el dueño, admin) |
| Roles con custom claims | El rol admin no se puede falsificar desde el navegador | Prueba: un cliente que se escribe `rol: 'admin'` sigue sin poder entrar al panel ni escribir productos |
| App Check (reCAPTCHA Enterprise) | Solo nuestra web puede llamar a Firestore, Storage y Functions; frena bots y scripts | Funciones con `enforceAppCheck: true`; una llamada sin token es rechazada |
| Lógica sensible en el servidor | Precios, descuentos, cupones y creación de pedidos solo en Functions | Prueba: alterar el precio en el navegador no cambia el total guardado |
| Validación de entrada | Esquemas zod en cada función, más validación de tipos y longitudes en las reglas | Pruebas con datos inválidos, campos extra y textos enormes |
| Idempotencia y límites de frecuencia | Sin pedidos duplicados ni abuso de los formularios | Pruebas: doble envío produce un solo pedido; el sexto pedido en 10 minutos es rechazado |
| Secretos fuera del código | La contraseña SMTP y otras claves van en **Secret Manager** (`defineSecret`), nunca en el repositorio ni en `environment.ts` | Revisión: `git grep` de claves conocidas sin resultados; *secret scanning* de GitHub activado |
| Clave de API restringida | La `apiKey` web es pública por diseño, pero se restringe en Google Cloud a los dominios de la web y a las APIs de Firebase | Revisión manual en la consola |
| Cabeceras HTTP de seguridad | En `firebase.json`: `Content-Security-Policy` (solo los orígenes necesarios: Firebase, Google Fonts, YouTube, Maps, reCAPTCHA), `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` y `frame-ancestors 'none'` | Revisión con securityheaders.com y la consola del navegador sin violaciones de CSP |
| Protección de cuentas | Contraseña mínima de 8 caracteres (política de contraseñas de Firebase), protección contra enumeración de correos, una cuenta por correo, 2FA en las cuentas de Google de los admins | Revisión manual de la configuración de Auth |
| Sin HTML inseguro | Angular escapa por defecto; prohibido `innerHTML` y `bypassSecurityTrust*`; plantillas de correo con escape | Regla de ESLint que lo prohíbe |
| Dependencias al día | Dependabot y `npm audit` en CI | CI falla con vulnerabilidades altas o críticas |
| Revisión antes de fusionar | Cada fase pasa por `/code-review` y `/security-review` antes de entrar a `main` | Los hallazgos se corrigen o se justifican por escrito en el PR |

### 9.2 Privacidad (Ley 1581 de 2012, habeas data)

- **Política de tratamiento de datos** publicada en `/privacidad`. Dice quién es el responsable, qué datos se recogen, para qué, por cuánto tiempo y cómo ejercer los derechos.
- **Autorización expresa** al crear la cuenta: una casilla obligatoria y sin marcar por defecto, que enlaza a la política. Se guarda la fecha y la versión aceptada.
- **Correos promocionales** solo con un consentimiento aparte. El de bienvenida con el cupón se envía como parte del registro.
- **Datos mínimos**: nombre, correo, teléfono y dirección. Nada más.
- **Eliminar mi cuenta** en `/mi-cuenta`: una función borra el usuario de Auth y su perfil. En los pedidos se conservan los montos (para la contabilidad), pero se anonimizan los datos personales.
- Solo el admin ve los datos de los clientes. Los logs no guardan teléfonos ni direcciones.

### 9.3 Calidad y estructura

- **Dos proyectos de Firebase**: `heladeria-dev` para desarrollo y pruebas, y `heladeria-1735d` para producción. Nunca se prueba contra los datos reales.
- **TypeScript estricto**, que ya está activo, y **ESLint** con las reglas de Angular.
- **Modelos compartidos** entre la web y las funciones (`Producto`, `Pedido`, `Cupon`…), para que no se desincronicen.
- **Pruebas**:
  - unitarias de servicios y funciones (cálculo de totales, cupones, transiciones de estado);
  - de reglas en el emulador;
  - de navegador (Playwright) para los flujos completos: entrar, pedir con cupón, ver el pedido, gestionarlo como admin.
- **Integración continua (GitHub Actions)** en cada PR: lint → build → pruebas unitarias → pruebas de reglas → pruebas de navegador contra emuladores. Si algo falla, no se puede fusionar.
- **Protección de la rama `main`**: solo entra por PR con CI en verde.
- **Despliegue**:
  - cada PR publica una vista previa en un *preview channel* de Hosting;
  - producción se publica solo desde `main`;
  - las reglas y los índices se despliegan junto con el código, versionados en el repo.
- **Operación**:
  - alerta de presupuesto;
  - alertas de errores en Functions (Cloud Monitoring);
  - copias de seguridad de Firestore (*point-in-time recovery* o exportación programada).
- **Accesibilidad**: navegable con teclado, etiquetas en los formularios, contraste suficiente. Se revisa con Lighthouse.

## 10. Decisiones pendientes

1. **Plan Blaze:** ¿se puede activar? Es necesario para Functions y para el correo.
2. **Proveedor de correo:** Gmail con contraseña de aplicación (rápido para empezar) o SendGrid/Resend (más profesional, requiere dominio propio).
3. **Pagos:** contra entrega/WhatsApp (por defecto) o pago en línea con Wompi o Mercado Pago (fase futura).
4. **Precios** de cada helado y malteada.
5. **Cupón:** ¿vence a los 30 días y vale solo para un pedido?
6. **Domicilio:** ¿hay costo de envío o un pedido mínimo?
7. **Proyecto de desarrollo:** ¿se puede crear un segundo proyecto de Firebase (`heladeria-dev`) para pruebas? Es gratis si no se activa Blaze en él; las funciones se prueban con los emuladores.
8. **Responsable de los datos:** nombre o razón social, NIT o cédula y correo de contacto para la política de privacidad.

Decidido:
- Login con **Google** como opción principal y **correo/contraseña** para quien no tenga Google (con verificación de correo).

## 11. Fases

| # | Fase | Contenido | Se verifica cuando… |
|---|---|---|---|
| 0 | Preparación | Fusionar `actualizar-angular` → `main`; protección de `main`; proyecto `heladeria-dev`; Blaze y alerta de presupuesto en producción; activar Auth (Google + correo, una cuenta por correo, política de contraseñas, protección contra enumeración), Firestore, Storage y App Check; restringir la clave de API; extensión de correo con secreto en Secret Manager; emuladores; CI básico (lint + build) | El proyecto corre contra los emuladores y el CI está en verde |
| 1 | Base | Migración a standalone, rutas por zona, SDK de Firebase, `AuthService`, guards, reglas que niegan todo por defecto, **pruebas de reglas en CI**, cabeceras de seguridad, ESLint | Las rutas protegidas redirigen bien; las pruebas de reglas pasan; la CSP no rompe nada |
| 2 | Cuentas | Botón de Google; crear cuenta e ingresar con correo; autorización de datos; verificación y reenvío; recuperar contraseña; completar perfil; menú de usuario; salir; `asignarAdmin` y script del primer admin; eliminar mi cuenta; `/privacidad` | Entrar con Google y con correo; el correo sin verificar no puede pedir; recuperar contraseña funciona; Google y correo con el mismo email son una sola cuenta |
| 3 | Catálogo admin | CRUD de productos con foto; catálogo público desde Firestore; *seed* | El admin sube un helado y aparece en la web |
| 4 | Pedidos | Carrito, `crearPedido` (idempotente, con límite de frecuencia), Mis pedidos, `cambiarEstadoPedido` con transiciones válidas | Pedido completo; doble envío = un pedido; precio alterado en el navegador no cambia el total; transición inválida rechazada |
| 5 | Cupones y correo | `alCrearUsuario`, correo de bienvenida con escape de HTML, aplicación del 15 %, anti-repetición por correo normalizado | Llega el correo; el cupón funciona una sola vez; recrear la cuenta o usar un alias de Gmail no da otro cupón |
| 6 | Formularios | Inconvenientes, aspirantes y empleados → `enviarMensaje` → `mensajes`; bandeja del admin | El admin ve los mensajes; spam limitado; ya no se usa `localStorage` |
| 7 | Cierre | Pruebas de navegador de todos los flujos, Lighthouse (rendimiento y accesibilidad), revisión de seguridad completa, copias de seguridad y alertas | Todo en verde; publicado en producción desde `main` |

**Cómo se trabaja cada fase:**
1. Rama propia desde `main`.
2. Código, más las pruebas de esa fase (unitarias, de reglas y de navegador según corresponda).
3. CI en verde y vista previa en un *preview channel*.
4. `/code-review` y `/security-review`, y corrección de los hallazgos.
5. Revisión del dueño en la vista previa.
6. PR → `main` → publicación en producción.

Las pruebas de seguridad no se dejan para el final: cada fase incluye las de lo que construye.
