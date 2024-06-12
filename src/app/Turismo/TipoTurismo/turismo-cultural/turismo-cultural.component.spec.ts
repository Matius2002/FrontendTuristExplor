import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurismoCulturalComponent } from './turismo-cultural.component';

describe('TurismoCulturalComponent', () => {
  let component: TurismoCulturalComponent;
  let fixture: ComponentFixture<TurismoCulturalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurismoCulturalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TurismoCulturalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
