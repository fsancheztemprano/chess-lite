import { TestBed } from '@angular/core/testing';
import { stubContextMenuServiceProvider } from './context-menu.service.stub';

import { CoreService } from './core.service';
import { stubHeaderServiceProvider } from './header.service.stub';
import { stubToolbarServiceProvider } from './toolbar.service.stub';

describe('CoreService', () => {
  let service: CoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubToolbarServiceProvider, stubHeaderServiceProvider, stubContextMenuServiceProvider],
    });
    service = TestBed.inject(CoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
