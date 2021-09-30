import { TestBed } from '@angular/core/testing';
import { CardViewHeaderService } from './card-view-header.service';

describe('HeaderService', () => {
  let service: CardViewHeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardViewHeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
