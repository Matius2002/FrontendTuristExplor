import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiasContenidoComponent } from './noticias-contenido.component';

describe('NoticiasContenidoComponent', () => {
  let component: NoticiasContenidoComponent;
  let fixture: ComponentFixture<NoticiasContenidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticiasContenidoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NoticiasContenidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
