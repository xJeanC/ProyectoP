import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-seccion',
    templateUrl: './seccion.component.html',
    styleUrls: ['./seccion.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SeccionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
