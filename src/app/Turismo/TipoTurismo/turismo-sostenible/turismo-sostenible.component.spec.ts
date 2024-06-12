import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurismoSostenibleComponent } from './turismo-sostenible.component';

describe('TurismoSostenibleComponent', () => {
  let component: TurismoSostenibleComponent;
  let fixture: ComponentFixture<TurismoSostenibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurismoSostenibleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TurismoSostenibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
