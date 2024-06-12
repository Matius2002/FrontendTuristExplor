import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaAtracionesComponent } from './nueva-atraciones.component';

describe('NuevaAtracionesComponent', () => {
  let component: NuevaAtracionesComponent;
  let fixture: ComponentFixture<NuevaAtracionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaAtracionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevaAtracionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
