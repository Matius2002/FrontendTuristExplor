import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesDestinosComponent } from './detalles-destinos.component';

describe('DetallesDestinosComponent', () => {
  let component: DetallesDestinosComponent;
  let fixture: ComponentFixture<DetallesDestinosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesDestinosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetallesDestinosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
