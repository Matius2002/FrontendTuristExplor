import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurismoNocturnoComponent } from './turismo-nocturno.component';

describe('TurismoNocturnoComponent', () => {
  let component: TurismoNocturnoComponent;
  let fixture: ComponentFixture<TurismoNocturnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurismoNocturnoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TurismoNocturnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
