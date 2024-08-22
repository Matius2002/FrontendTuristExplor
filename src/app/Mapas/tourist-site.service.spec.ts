import { TestBed } from '@angular/core/testing';

import { TouristSiteService } from './tourist-site.service';

describe('TouristSiteService', () => {
  let service: TouristSiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TouristSiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
