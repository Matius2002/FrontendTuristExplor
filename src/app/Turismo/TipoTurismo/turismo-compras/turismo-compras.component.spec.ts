import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurismoComprasComponent } from './turismo-compras.component';

describe('TurismoComprasComponent', () => {
  let component: TurismoComprasComponent;
  let fixture: ComponentFixture<TurismoComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurismoComprasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TurismoComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
