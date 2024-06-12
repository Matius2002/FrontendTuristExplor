import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarTopbarComponent } from './navbar-topbar.component';

describe('NavbarTopbarComponent', () => {
  let component: NavbarTopbarComponent;
  let fixture: ComponentFixture<NavbarTopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarTopbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
