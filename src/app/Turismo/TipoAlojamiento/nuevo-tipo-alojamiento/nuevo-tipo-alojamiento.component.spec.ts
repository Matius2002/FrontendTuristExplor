import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoTipoAlojamientoComponent } from './nuevo-tipo-alojamiento.component';

describe('NuevoTipoAlojamientoComponent', () => {
  let component: NuevoTipoAlojamientoComponent;
  let fixture: ComponentFixture<NuevoTipoAlojamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoTipoAlojamientoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevoTipoAlojamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
