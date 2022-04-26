import { TestBed } from '@angular/core/testing';
import { stubCoreContextMenuServiceProvider } from '../modules/core-context-menu/services/core-context-menu.service.stub';
import { stubCardViewHeaderServiceProvider } from './card-view/card-view-header.service.stub';
import { CoreService } from './core.service';
import { stubToolbarServiceProvider } from './toolbar/toolbar.service.stub';

describe('CoreService', () => {
  let service: CoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubToolbarServiceProvider, stubCardViewHeaderServiceProvider, stubCoreContextMenuServiceProvider],
    });
    service = TestBed.inject(CoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
