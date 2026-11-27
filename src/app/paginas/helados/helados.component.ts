import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Producto } from '../../componentes/productos/productos.component';

@Component({
  selector: 'app-helados',
  templateUrl: './helados.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class HeladosComponent {
  // Para usar fotos propias, agrega `imagen: 'assets/img/<archivo>.jpg'` a cada producto.
  readonly helados: Producto[] = [
    { nombre: 'Helado de chocolate', descripcion: 'Cremoso, intenso y para los amantes del cacao.', color: '#d8b39c', emoji: '🍫' },
    { nombre: 'Helado de fresa', descripcion: 'Fresas de verdad en cada cucharada.', color: '#f7b6c8', emoji: '🍓' },
    { nombre: 'Helado de arándanos', descripcion: 'Dulce y ácido a la vez, muy refrescante.', color: '#c3bdf0', emoji: '🫐' },
    { nombre: 'Helado de café', descripcion: 'El empujón perfecto para seguir estudiando.', color: '#e1c6a8', emoji: '☕' },
    { nombre: 'Helado de dulce de leche', descripcion: 'Suave y acaramelado, un clásico de siempre.', color: '#f1d29e', emoji: '🍮' },
    { nombre: 'Helado de mora', descripcion: 'Sabor a fruta del campo, intenso y natural.', color: '#d6b0d6', emoji: '🍇' },
  ];
}
