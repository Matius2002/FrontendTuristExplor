import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAtracionesComponent } from './editar-atraciones.component';

describe('EditarAtracionesComponent', () => {
  let component: EditarAtracionesComponent;
  let fixture: ComponentFixture<EditarAtracionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarAtracionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarAtracionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
