import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaImagesComponent } from './nueva-images.component';

describe('NuevaImagesComponent', () => {
  let component: NuevaImagesComponent;
  let fixture: ComponentFixture<NuevaImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaImagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevaImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
