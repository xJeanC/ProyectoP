import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';

interface Slide {
  imagen: string;
  alt: string;
}

@Component({
  selector: 'app-carrusel',
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CarruselComponent implements OnInit, OnDestroy {
  readonly slides: Slide[] = [
    {
      imagen: 'assets/img/4425467.jpg',
      alt: 'Helados de varios sabores',
    },
    {
      imagen: 'assets/img/Carrusel%202.jpg',
      alt: 'Copa de helado con toppings',
    },
    {
      imagen: 'assets/img/Paletas.jpg',
      alt: 'Paletas de frutas',
    },
  ];

  actual = 0;
  private temporizador?: ReturnType<typeof setInterval>;
  private readonly movimientoReducido =
    typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  ngOnInit(): void {
    this.reanudar();
  }

  ngOnDestroy(): void {
    this.pausar();
  }

  siguiente(): void {
    this.actual = (this.actual + 1) % this.slides.length;
  }

  anterior(): void {
    this.actual = (this.actual - 1 + this.slides.length) % this.slides.length;
  }

  ir(indice: number): void {
    this.actual = indice;
  }

  pausar(): void {
    clearInterval(this.temporizador);
    this.temporizador = undefined;
  }

  reanudar(): void {
    if (this.movimientoReducido || this.temporizador) {
      return;
    }
    this.temporizador = setInterval(() => this.siguiente(), 6000);
  }
}
