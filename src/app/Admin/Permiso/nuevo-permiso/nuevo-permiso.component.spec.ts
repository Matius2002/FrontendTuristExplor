import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoPermisoComponent } from './nuevo-permiso.component';

describe('NuevoPermisoComponent', () => {
  let component: NuevoPermisoComponent;
  let fixture: ComponentFixture<NuevoPermisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoPermisoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevoPermisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
