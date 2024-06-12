import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtracionesPrincipalComponent } from './atraciones-principal.component';

describe('AtracionesPrincipalComponent', () => {
  let component: AtracionesPrincipalComponent;
  let fixture: ComponentFixture<AtracionesPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtracionesPrincipalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AtracionesPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
