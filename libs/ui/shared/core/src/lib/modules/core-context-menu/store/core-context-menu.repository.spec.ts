import { TestBed } from '@angular/core/testing';
import { CoreContextMenuRepository } from './core-context-menu.repository';

describe('CoreContextMenuRepository', () => {
  let service: CoreContextMenuRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreContextMenuRepository],
    });
    service = TestBed.inject(CoreContextMenuRepository);
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

    service.setOptions(options);

    service.coreContextMenuOptions$.subscribe((menuOptions) => {
      expect(options).toEqual(menuOptions);
      done();
    });
  });
});
