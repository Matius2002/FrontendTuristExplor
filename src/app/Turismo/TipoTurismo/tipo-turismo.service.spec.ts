import { TestBed } from '@angular/core/testing';

import { TipoTurismoService } from './tipo-turismo.service';

describe('TipoTurismoService', () => {
  let service: TipoTurismoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoTurismoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
