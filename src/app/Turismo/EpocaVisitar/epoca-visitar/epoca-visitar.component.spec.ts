import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpocaVisitarComponent } from './epoca-visitar.component';

describe('EpocaVisitarComponent', () => {
  let component: EpocaVisitarComponent;
  let fixture: ComponentFixture<EpocaVisitarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpocaVisitarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EpocaVisitarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
