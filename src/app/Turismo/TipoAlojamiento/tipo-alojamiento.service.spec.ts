import { TestBed } from '@angular/core/testing';

import { TipoAlojamientoService } from './tipo-alojamiento.service';

describe('TipoAlojamientoService', () => {
  let service: TipoAlojamientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoAlojamientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
