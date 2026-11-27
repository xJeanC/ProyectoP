import { TestBed } from '@angular/core/testing';
import { DatosRegistro, RegistrosService } from './registros.service';

const datos = (nombre: string): DatosRegistro => ({
  nombre,
  apellido: 'Pérez',
  correo: `${nombre.toLowerCase()}@correo.com`,
  telefono: '3001234567',
  detalle: 'Detalle de prueba',
});

describe('RegistrosService', () => {
  let servicio: RegistrosService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    servicio = TestBed.inject(RegistrosService);
  });

  it('detecta que localStorage está disponible', () => {
    expect(servicio.disponible).toBe(true);
  });

  it('crea registros con ids consecutivos y los persiste', () => {
    servicio.crear('prueba', datos('Ana'));
    servicio.crear('prueba', datos('Luis'));

    const registros = servicio.listar('prueba');
    expect(registros.map((r) => r.id)).toEqual([1, 2]);
    expect(JSON.parse(localStorage.getItem('icecul.prueba') ?? '[]')).toHaveLength(2);
  });

  it('actualiza un registro sin duplicarlo ni cambiar su id', () => {
    const { id } = servicio.crear('prueba', datos('Ana'));
    servicio.actualizar('prueba', id, { ...datos('Ana'), nombre: 'Ana María' });

    const registros = servicio.listar('prueba');
    expect(registros).toHaveLength(1);
    expect(registros[0]).toMatchObject({ id, nombre: 'Ana María' });
  });

  it('elimina solo el registro indicado y no reutiliza ids ocupados', () => {
    servicio.crear('prueba', datos('Ana'));
    const luis = servicio.crear('prueba', datos('Luis'));
    servicio.eliminar('prueba', 1);

    expect(servicio.listar('prueba').map((r) => r.nombre)).toEqual(['Luis']);
    expect(servicio.crear('prueba', datos('Sara')).id).toBe(luis.id + 1);
  });

  it('mantiene separadas las listas de cada formulario', () => {
    servicio.crear('inconvenientes', datos('Ana'));
    servicio.crear('aspirantes', datos('Luis'));

    expect(servicio.listar('inconvenientes')).toHaveLength(1);
    expect(servicio.listar('aspirantes')).toHaveLength(1);
  });

  it('ignora datos corruptos en localStorage sin romper la página', () => {
    localStorage.setItem('icecul.prueba', '{no es json');
    expect(servicio.listar('prueba')).toEqual([]);

    localStorage.setItem('icecul.prueba', JSON.stringify([{ basura: true }, { id: 3, nombre: 'Ok' }]));
    expect(servicio.listar('prueba').map((r) => r.id)).toEqual([3]);
  });
});
