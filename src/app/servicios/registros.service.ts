import { Injectable } from '@angular/core';

export interface Registro {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  detalle: string;
  /** Fecha de creación o última edición, en formato ISO. */
  fecha: string;
}

export type DatosRegistro = Omit<Registro, 'id' | 'fecha'>;

/**
 * Guarda los registros de los formularios en localStorage, una lista por formulario.
 * El proyecto no tiene base de datos: los datos quedan solo en el navegador de quien los llena.
 */
@Injectable({ providedIn: 'root' })
export class RegistrosService {
  private readonly prefijo = 'icecul.';
  private readonly memoria = new Map<string, Registro[]>();

  /** false si el navegador bloquea localStorage (modo privado estricto, cookies bloqueadas…). */
  readonly disponible = this.probarAlmacenamiento();

  listar(clave: string): Registro[] {
    if (!this.disponible) {
      return [...(this.memoria.get(clave) ?? [])];
    }
    try {
      const crudo = localStorage.getItem(this.prefijo + clave);
      const datos: unknown = crudo ? JSON.parse(crudo) : [];
      return Array.isArray(datos) ? datos.filter(esRegistro) : [];
    } catch {
      return [];
    }
  }

  crear(clave: string, datos: DatosRegistro): Registro {
    const registros = this.listar(clave);
    const id = registros.reduce((max, r) => Math.max(max, r.id), 0) + 1;
    const nuevo: Registro = { ...datos, id, fecha: new Date().toISOString() };
    this.guardar(clave, [...registros, nuevo]);
    return nuevo;
  }

  actualizar(clave: string, id: number, datos: DatosRegistro): Registro | undefined {
    let actualizado: Registro | undefined;
    const registros = this.listar(clave).map((r) => {
      if (r.id !== id) {
        return r;
      }
      actualizado = { ...r, ...datos, fecha: new Date().toISOString() };
      return actualizado;
    });
    this.guardar(clave, registros);
    return actualizado;
  }

  eliminar(clave: string, id: number): void {
    this.guardar(clave, this.listar(clave).filter((r) => r.id !== id));
  }

  private guardar(clave: string, registros: Registro[]): void {
    if (!this.disponible) {
      this.memoria.set(clave, registros);
      return;
    }
    try {
      localStorage.setItem(this.prefijo + clave, JSON.stringify(registros));
    } catch {
      this.memoria.set(clave, registros);
    }
  }

  private probarAlmacenamiento(): boolean {
    try {
      const prueba = this.prefijo + '__prueba__';
      localStorage.setItem(prueba, '1');
      localStorage.removeItem(prueba);
      return true;
    } catch {
      return false;
    }
  }
}

function esRegistro(valor: unknown): valor is Registro {
  const r = valor as Registro;
  return typeof r === 'object' && r !== null && typeof r.id === 'number' && typeof r.nombre === 'string';
}
