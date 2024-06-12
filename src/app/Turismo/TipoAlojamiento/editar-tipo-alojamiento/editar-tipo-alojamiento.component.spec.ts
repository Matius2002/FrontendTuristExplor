import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarTipoAlojamientoComponent } from './editar-tipo-alojamiento.component';

describe('EditarTipoAlojamientoComponent', () => {
  let component: EditarTipoAlojamientoComponent;
  let fixture: ComponentFixture<EditarTipoAlojamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarTipoAlojamientoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarTipoAlojamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
