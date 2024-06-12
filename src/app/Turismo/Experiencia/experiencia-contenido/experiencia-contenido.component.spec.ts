import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienciaContenidoComponent } from './experiencia-contenido.component';

describe('ExperienciaContenidoComponent', () => {
  let component: ExperienciaContenidoComponent;
  let fixture: ComponentFixture<ExperienciaContenidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienciaContenidoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExperienciaContenidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
