/**
 * Punto de entrada de las Cloud Functions de IceCul.
 *
 * Fase 0: sin funciones todavía. Aquí se exportarán, fase por fase (ver docs/PLAN.md):
 *   - alCrearUsuario      (fase 5)  perfil + cupón de bienvenida + correo
 *   - asignarAdmin        (fase 2)  custom claim admin, solo invocable por admins
 *   - eliminarCuenta      (fase 2)  borrado de cuenta y anonimización
 *   - crearPedido         (fase 4)  precios reales, cupón, idempotencia, límites
 *   - cambiarEstadoPedido (fase 4)  transiciones válidas + historial
 *   - enviarMensaje       (fase 6)  formularios públicos con validación y límites
 */
import { setGlobalOptions } from 'firebase-functions/v2';

// Misma región que Firestore (us-east1). Tope de instancias para acotar costos ante abuso.
setGlobalOptions({ region: 'us-east1', maxInstances: 10 });
