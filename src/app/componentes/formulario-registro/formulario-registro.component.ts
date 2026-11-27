import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { enlaceWhatsapp } from '../../contacto';
import { DatosRegistro, Registro, RegistrosService } from '../../servicios/registros.service';

type Campo = 'nombre' | 'apellido' | 'correo' | 'telefono' | 'detalle';

export interface ConfigFormulario {
  /** Nombre de la lista en localStorage. Debe ser distinto para cada formulario. */
  clave: string;
  eyebrow: string;
  titulo: string;
  descripcion: string;
  /** Etiqueta y ayuda del campo de texto libre (problema, experiencia, cargo…). */
  campoDetalle: { etiqueta: string; placeholder: string };
  /** Primera línea del mensaje de WhatsApp. */
  asuntoWhatsapp: string;
}

@Component({
  selector: 'app-formulario-registro',
  templateUrl: './formulario-registro.component.html',
  styleUrls: ['./formulario-registro.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FormularioRegistroComponent implements OnInit {
  @Input({ required: true }) config!: ConfigFormulario;
  @ViewChild('tarjetaFormulario') private tarjetaFormulario?: ElementRef<HTMLElement>;

  private readonly fb = inject(FormBuilder);
  protected readonly almacen = inject(RegistrosService);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(60)]],
    apellido: ['', [Validators.required, Validators.maxLength(60)]],
    correo: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    telefono: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]{7,15}$/)]],
    detalle: ['', [Validators.required, Validators.maxLength(500)]],
  });

  registros: Registro[] = [];
  editandoId: number | null = null;
  /** Último registro guardado, para ofrecer enviarlo por WhatsApp. */
  guardado: Registro | null = null;

  ngOnInit(): void {
    this.cargar();
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const datos = this.limpiar(this.form.getRawValue());
    this.guardado =
      this.editandoId === null
        ? this.almacen.crear(this.config.clave, datos)
        : this.almacen.actualizar(this.config.clave, this.editandoId, datos) ?? null;

    this.reiniciar();
    this.cargar();
  }

  editar(registro: Registro): void {
    this.editandoId = registro.id;
    this.guardado = null;
    this.form.setValue({
      nombre: registro.nombre,
      apellido: registro.apellido,
      correo: registro.correo,
      telefono: registro.telefono,
      detalle: registro.detalle ?? '',
    });
    this.tarjetaFormulario?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  cancelar(): void {
    this.reiniciar();
  }

  eliminar(registro: Registro): void {
    if (!confirm(`¿Eliminar el registro de ${registro.nombre} ${registro.apellido}?`)) {
      return;
    }
    this.almacen.eliminar(this.config.clave, registro.id);
    if (this.editandoId === registro.id) {
      this.reiniciar();
    }
    if (this.guardado?.id === registro.id) {
      this.guardado = null;
    }
    this.cargar();
  }

  whatsapp(registro: Registro): string {
    return enlaceWhatsapp(
      [
        this.config.asuntoWhatsapp,
        `Nombre: ${registro.nombre} ${registro.apellido}`,
        `Correo: ${registro.correo}`,
        `Teléfono: ${registro.telefono}`,
        `${this.config.campoDetalle.etiqueta}: ${registro.detalle}`,
      ].join('\n'),
    );
  }

  invalido(campo: Campo): boolean {
    const control = this.form.controls[campo];
    return control.invalid && (control.touched || control.dirty);
  }

  private cargar(): void {
    this.registros = this.almacen.listar(this.config.clave);
  }

  private reiniciar(): void {
    this.editandoId = null;
    this.form.reset();
  }

  private limpiar(datos: DatosRegistro): DatosRegistro {
    return {
      nombre: datos.nombre.trim(),
      apellido: datos.apellido.trim(),
      correo: datos.correo.trim(),
      telefono: datos.telefono.trim(),
      detalle: datos.detalle.trim(),
    };
  }
}
