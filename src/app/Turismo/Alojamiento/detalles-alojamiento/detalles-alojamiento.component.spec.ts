import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesAlojamientoComponent } from './detalles-alojamiento.component';

describe('DetallesAlojamientoComponent', () => {
  let component: DetallesAlojamientoComponent;
  let fixture: ComponentFixture<DetallesAlojamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesAlojamientoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetallesAlojamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
