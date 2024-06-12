import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventoContenidoComponent } from './evento-contenido.component';

describe('EventoContenidoComponent', () => {
  let component: EventoContenidoComponent;
  let fixture: ComponentFixture<EventoContenidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventoContenidoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventoContenidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
