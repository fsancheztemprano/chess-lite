import { TestBed } from '@angular/core/testing';
import { CoreContextMenuService } from './core-context-menu.service';

describe('ContextMenuService', () => {
  let service: CoreContextMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoreContextMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
