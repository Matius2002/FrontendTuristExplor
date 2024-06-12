import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurismoReligiosoComponent } from './turismo-religioso.component';

describe('TurismoReligiosoComponent', () => {
  let component: TurismoReligiosoComponent;
  let fixture: ComponentFixture<TurismoReligiosoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurismoReligiosoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TurismoReligiosoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
