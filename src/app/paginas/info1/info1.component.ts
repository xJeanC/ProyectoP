import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ConfigFormulario } from '../../componentes/formulario-registro/formulario-registro.component';

@Component({
  selector: 'app-info1',
  template: '<app-formulario-registro [config]="config"></app-formulario-registro>',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class Info1Component {
  readonly config: ConfigFormulario = {
    clave: 'inconvenientes',
    eyebrow: 'Atención al cliente',
    titulo: 'Cuéntanos tu inconveniente',
    descripcion: 'Si algo no salió bien con tu pedido o tu visita, déjanos tus datos y lo que pasó. Te contactaremos pronto.',
    campoDetalle: { etiqueta: '¿Qué pasó?', placeholder: 'Describe el inconveniente con el mayor detalle posible.' },
    asuntoWhatsapp: '¡Hola IceCul! Quiero reportar un inconveniente.',
  };
}
