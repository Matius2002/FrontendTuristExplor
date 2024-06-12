import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEpocaVisitarComponent } from './editar-epoca-visitar.component';

describe('EditarEpocaVisitarComponent', () => {
  let component: EditarEpocaVisitarComponent;
  let fixture: ComponentFixture<EditarEpocaVisitarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarEpocaVisitarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarEpocaVisitarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
