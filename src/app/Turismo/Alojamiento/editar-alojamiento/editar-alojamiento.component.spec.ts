import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAlojamientoComponent } from './editar-alojamiento.component';

describe('EditarAlojamientoComponent', () => {
  let component: EditarAlojamientoComponent;
  let fixture: ComponentFixture<EditarAlojamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarAlojamientoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarAlojamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
