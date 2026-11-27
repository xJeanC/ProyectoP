import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ConfigFormulario } from '../../componentes/formulario-registro/formulario-registro.component';

@Component({
  selector: 'app-info3',
  template: '<app-formulario-registro [config]="config"></app-formulario-registro>',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class Info3Component {
  readonly config: ConfigFormulario = {
    clave: 'empleados',
    eyebrow: 'Equipo IceCul',
    titulo: '¿Ya trabajas con nosotros?',
    descripcion: 'Actualiza tus datos de contacto para que podamos comunicarnos contigo.',
    campoDetalle: { etiqueta: 'Cargo', placeholder: 'Por ejemplo: atención en caja, domiciliario, preparación.' },
    asuntoWhatsapp: '¡Hola IceCul! Soy parte del equipo y actualizo mis datos.',
  };
}
