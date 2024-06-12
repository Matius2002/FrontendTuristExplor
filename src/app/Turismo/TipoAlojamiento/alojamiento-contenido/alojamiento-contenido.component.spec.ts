import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlojamientoContenidoComponent } from './alojamiento-contenido.component';

describe('AlojamientoContenidoComponent', () => {
  let component: AlojamientoContenidoComponent;
  let fixture: ComponentFixture<AlojamientoContenidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlojamientoContenidoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlojamientoContenidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
