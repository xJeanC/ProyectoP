import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MalteadasComponent } from './malteadas.component';

describe('MalteadasComponent', () => {
  let component: MalteadasComponent;
  let fixture: ComponentFixture<MalteadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MalteadasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MalteadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
