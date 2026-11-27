import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { enlaceWhatsapp } from '../../contacto';

export interface Producto {
  nombre: string;
  descripcion: string;
  /** Color del sabor; se usa de fondo cuando no hay foto o la foto no carga. */
  color: string;
  emoji: string;
  /** Foto opcional, por ejemplo 'assets/img/helado-fresa.jpg'. */
  imagen?: string;
}

/** Cuadrícula de tarjetas de producto con botón para pedir por WhatsApp. */
@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ProductosComponent {
  @Input({ required: true }) productos: Producto[] = [];

  /** Fotos que fallaron al cargar, para mostrar el respaldo de color. */
  readonly fallidas = new Set<string>();

  pedir(producto: Producto): string {
    return enlaceWhatsapp(`¡Hola IceCul! Quiero pedir: ${producto.nombre}.`);
  }
}
