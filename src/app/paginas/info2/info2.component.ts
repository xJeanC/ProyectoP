import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ConfigFormulario } from '../../componentes/formulario-registro/formulario-registro.component';

@Component({
  selector: 'app-info2',
  template: '<app-formulario-registro [config]="config"></app-formulario-registro>',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class Info2Component {
  readonly config: ConfigFormulario = {
    clave: 'aspirantes',
    eyebrow: 'Trabaja con nosotros',
    titulo: '¿Quieres trabajar en IceCul?',
    descripcion: 'Regístrate y nos pondremos en contacto contigo con toda la información.',
    campoDetalle: {
      etiqueta: 'Cuéntanos de ti',
      placeholder: 'Tu experiencia, disponibilidad de horario y el cargo que te interesa.',
    },
    asuntoWhatsapp: '¡Hola IceCul! Quiero trabajar con ustedes.',
  };
}
