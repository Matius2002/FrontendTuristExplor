import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarImagesComponent } from './editar-images.component';

describe('EditarImagesComponent', () => {
  let component: EditarImagesComponent;
  let fixture: ComponentFixture<EditarImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarImagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
