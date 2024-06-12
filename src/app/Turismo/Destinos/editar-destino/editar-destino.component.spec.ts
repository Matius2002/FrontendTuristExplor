import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarDestinoComponent } from './editar-destino.component';

describe('EditarDestinoComponent', () => {
  let component: EditarDestinoComponent;
  let fixture: ComponentFixture<EditarDestinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarDestinoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarDestinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
