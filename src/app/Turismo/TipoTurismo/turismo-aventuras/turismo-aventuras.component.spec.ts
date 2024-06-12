import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurismoAventurasComponent } from './turismo-aventuras.component';

describe('TurismoAventurasComponent', () => {
  let component: TurismoAventurasComponent;
  let fixture: ComponentFixture<TurismoAventurasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurismoAventurasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TurismoAventurasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
