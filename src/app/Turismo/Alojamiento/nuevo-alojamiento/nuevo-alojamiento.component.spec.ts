import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoAlojamientoComponent } from './nuevo-alojamiento.component';

describe('NuevoAlojamientoComponent', () => {
  let component: NuevoAlojamientoComponent;
  let fixture: ComponentFixture<NuevoAlojamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoAlojamientoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevoAlojamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
