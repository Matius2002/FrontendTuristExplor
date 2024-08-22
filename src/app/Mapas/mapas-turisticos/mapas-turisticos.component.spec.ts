import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapasTuristicosComponent } from './mapas-turisticos.component';

describe('MapasTuristicosComponent', () => {
  let component: MapasTuristicosComponent;
  let fixture: ComponentFixture<MapasTuristicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapasTuristicosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapasTuristicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
