import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteSitiosComponent } from './reporte-sitios.component';

describe('ReporteSitiosComponent', () => {
  let component: ReporteSitiosComponent;
  let fixture: ComponentFixture<ReporteSitiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteSitiosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteSitiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
