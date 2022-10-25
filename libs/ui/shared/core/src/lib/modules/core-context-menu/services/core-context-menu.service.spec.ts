import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
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

    service.reset();

    service.options$.subscribe((menuOptions) => {
      expect([]).toEqual(menuOptions);
      done();
    });
  });

  describe('show context menu', () => {
    it('should set context menu', () => {
      expect(service['_showMenu$'].value).toBeFalse();

      service.showMenu = true;

      expect(service['_showMenu$'].value).toBeTrue();
    });

    it('should get context menu', async () => {
      service.showMenu = true;

      return expect(firstValueFrom(service.showMenu$)).resolves.toBeTrue();
    });
  });

  it('should show menu with options', async () => {
    const options = [
      {
        icon: 'home',
      },
    ];

    service.show(options);

    await expect(firstValueFrom(service.showMenu$)).resolves.toBeTrue();
    return expect(firstValueFrom(service.options$)).resolves.toEqual(options);
  });
});
