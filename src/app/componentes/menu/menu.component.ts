import { ChangeDetectionStrategy, Component } from '@angular/core';
import { enlaceWhatsapp } from '../../contacto';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class MenuComponent {
  abierto = false;

  readonly whatsapp = enlaceWhatsapp('¡Hola IceCul! Quiero hacer un pedido.');

  readonly enlaces = [
    { ruta: '/helados', texto: 'Helados' },
    { ruta: '/malteadas', texto: 'Malteadas' },
    { ruta: '/contactos', texto: 'Contáctanos' },
    { ruta: '/informacion', texto: 'Información' },
  ];

  cerrar(): void {
    this.abierto = false;
  }
}
