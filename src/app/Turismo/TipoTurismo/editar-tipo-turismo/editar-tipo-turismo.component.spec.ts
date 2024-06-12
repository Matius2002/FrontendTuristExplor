import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarTipoTurismoComponent } from './editar-tipo-turismo.component';

describe('EditarTipoTurismoComponent', () => {
  let component: EditarTipoTurismoComponent;
  let fixture: ComponentFixture<EditarTipoTurismoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarTipoTurismoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarTipoTurismoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
