import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTACTO, enlaceWhatsapp } from '../../contacto';

@Component({
  selector: 'app-scont',
  templateUrl: './scont.component.html',
  styleUrls: ['./scont.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ScontComponent {
  readonly contacto = CONTACTO;
  readonly telefonoSinEspacios = CONTACTO.telefono.replace(/\D/g, '');
  readonly whatsapp = enlaceWhatsapp('¡Hola IceCul! Quiero hacer un pedido a domicilio.');

  readonly horarios = [
    { dia: 'Lunes', abre: '9:00 AM', cierra: '6:00 PM' },
    { dia: 'Martes', abre: '9:00 AM', cierra: '6:00 PM' },
    { dia: 'Miércoles', abre: '9:00 AM', cierra: '6:00 PM' },
    { dia: 'Jueves', abre: '9:00 AM', cierra: '6:00 PM' },
    { dia: 'Viernes', abre: '9:00 AM', cierra: '6:00 PM' },
    { dia: 'Sábado', abre: '9:00 AM', cierra: '9:00 PM' },
    { dia: 'Domingo', abre: '9:00 AM', cierra: '9:00 PM' },
  ];
}
