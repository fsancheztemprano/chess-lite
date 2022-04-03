import { TestBed } from '@angular/core/testing';
import { stubCardViewHeaderServiceProvider } from './card-view/card-view-header.service.stub';
import { stubContextMenuServiceProvider } from './context-menu/context-menu.service.stub';
import { CoreService } from './core.service';
import { stubToolbarServiceProvider } from './toolbar/toolbar.service.stub';

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
