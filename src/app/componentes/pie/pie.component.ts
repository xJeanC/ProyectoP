import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTACTO, enlaceWhatsapp } from '../../contacto';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PieComponent {
  readonly contacto = CONTACTO;
  readonly whatsapp = enlaceWhatsapp();
  readonly anio = new Date().getFullYear();
}
