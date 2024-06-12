import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoTipoTurismoComponent } from './nuevo-tipo-turismo.component';

describe('NuevoTipoTurismoComponent', () => {
  let component: NuevoTipoTurismoComponent;
  let fixture: ComponentFixture<NuevoTipoTurismoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoTipoTurismoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevoTipoTurismoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
