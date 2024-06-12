import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaEpocaVisitarComponent } from './nueva-epoca-visitar.component';

describe('NuevaEpocaVisitarComponent', () => {
  let component: NuevaEpocaVisitarComponent;
  let fixture: ComponentFixture<NuevaEpocaVisitarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaEpocaVisitarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevaEpocaVisitarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
