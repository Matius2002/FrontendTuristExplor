import { TestBed } from '@angular/core/testing';

import { AtracionesService } from './atraciones.service';

describe('AtracionesServiceService', () => {
  let service: AtracionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AtracionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
