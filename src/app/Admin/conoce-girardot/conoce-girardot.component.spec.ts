import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConoceGirardotComponent } from './conoce-girardot.component';

describe('ConoceGirardotComponent', () => {
  let component: ConoceGirardotComponent;
  let fixture: ComponentFixture<ConoceGirardotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConoceGirardotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConoceGirardotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
