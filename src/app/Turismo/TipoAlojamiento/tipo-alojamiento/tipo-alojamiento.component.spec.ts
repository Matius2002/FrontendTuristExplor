import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoAlojamientoComponent } from './tipo-alojamiento.component';

describe('TipoAlojamientoComponent', () => {
  let component: TipoAlojamientoComponent;
  let fixture: ComponentFixture<TipoAlojamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoAlojamientoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TipoAlojamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
