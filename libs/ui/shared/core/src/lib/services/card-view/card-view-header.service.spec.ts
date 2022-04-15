import { TestBed } from '@angular/core/testing';
import { stubBreadcrumbServiceProvider } from '../toolbar/breadcrumb.service.stub';
import { CardViewHeaderService } from './card-view-header.service';

describe('HeaderService', () => {
  let service: CardViewHeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [stubBreadcrumbServiceProvider] });
    service = TestBed.inject(CardViewHeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
