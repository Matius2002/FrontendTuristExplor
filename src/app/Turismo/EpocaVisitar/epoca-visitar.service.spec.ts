import { TestBed } from '@angular/core/testing';

import { EpocaVisitarService } from './epoca-visitar.service';

describe('EpocaVisitarService', () => {
  let service: EpocaVisitarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EpocaVisitarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
