import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sinfo',
  templateUrl: './sinfo.component.html',
  styleUrls: ['./sinfo.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SinfoComponent {
  readonly opciones = [
    {
      ruta: '/info1',
      icono: '💬',
      titulo: '¡Cuéntanos tus inconvenientes!',
      texto: '¿Algo salió mal? Queremos saberlo para mejorar.',
    },
    {
      ruta: '/info2',
      icono: '🍦',
      titulo: '¿Quieres trabajar con nosotros?',
      texto: 'Déjanos tus datos y te contactamos.',
    },
    {
      ruta: '/info3',
      icono: '🤝',
      titulo: '¿Ya trabajas con nosotros?',
      texto: 'Mantén tus datos de contacto al día.',
    },
  ];
}
