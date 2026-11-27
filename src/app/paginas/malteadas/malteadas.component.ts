import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Producto } from '../../componentes/productos/productos.component';

@Component({
  selector: 'app-malteadas',
  templateUrl: './malteadas.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class MalteadasComponent {
  // Para usar fotos propias, agrega `imagen: 'assets/img/<archivo>.jpg'` a cada producto.
  readonly malteadas: Producto[] = [
    { nombre: 'Malteada de kiwi', descripcion: 'Kiwi con banano y yogur, fresca y diferente.', color: '#cde6a8', emoji: '🥝' },
    { nombre: 'Malteada de fresa', descripcion: 'Fresa, banano y yogur: la favorita de todos.', color: '#f7b6c8', emoji: '🍓' },
    { nombre: 'Malteada de arándanos', descripcion: 'Arándanos con banano y yogur, llena de color.', color: '#c3bdf0', emoji: '🫐' },
    { nombre: 'Malteada de banano', descripcion: 'Banano con avena y yogur, ideal para recargar energía.', color: '#f6e39a', emoji: '🍌' },
    { nombre: 'Malteada de Oreo', descripcion: 'Galletas Oreo y helado de vainilla, cremosa y dulce.', color: '#d9d4d0', emoji: '🍪' },
    { nombre: 'Malteada de mora', descripcion: 'Mora, banano y yogur, con sabor bien criollo.', color: '#d6b0d6', emoji: '🍇' },
  ];
}
