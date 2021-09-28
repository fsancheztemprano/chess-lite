import { TestBed } from '@angular/core/testing';
import { stubCardViewHeaderServiceProvider } from '../modules/card-view/services/card-view-header.service.stub';
import { stubContextMenuServiceProvider } from '../modules/context-menu/services/context-menu.service.stub';
import { stubToolbarServiceProvider } from '../modules/toolbar/services/toolbar.service.stub';
import { CoreService } from './core.service';

describe('CoreService', () => {
  let service: CoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubToolbarServiceProvider, stubCardViewHeaderServiceProvider, stubContextMenuServiceProvider],
    });
    service = TestBed.inject(CoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
