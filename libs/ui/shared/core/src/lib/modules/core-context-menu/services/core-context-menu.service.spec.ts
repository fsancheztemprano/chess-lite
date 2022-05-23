import { TestBed } from '@angular/core/testing';
import { CoreContextMenuService } from './core-context-menu.service';
import { StubCoreContextMenuService } from './core-context-menu.service.stub';

describe('ContextMenuService', () => {
  let service: CoreContextMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StubCoreContextMenuService],
    });
    service = TestBed.inject(CoreContextMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set menu options', (done) => {
    const options = [
      {
        icon: 'home',
      },
    ];

    service.options = options;

    service.options$.subscribe((menuOptions) => {
      expect(options).toEqual(menuOptions);
      done();
    });
  });

  it('should reset menu options', (done) => {
    service.options = [
      {
        icon: 'home',
      },
    ];

    service.resetOptions();

    service.options$.subscribe((menuOptions) => {
      expect([]).toEqual(menuOptions);
      done();
    });
  });
});
