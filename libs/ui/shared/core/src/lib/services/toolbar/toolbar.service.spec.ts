import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { ToolbarService } from './toolbar.service';

describe('ToolbarService', () => {
  let service: ToolbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToolbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('show locale picker', () => {
    it('should set locale picker', () => {
      expect(service['_showLocalePicker$'].value).toBeTrue();

      service.showLocalePicker = false;

      expect(service['_showLocalePicker$'].value).toBeFalse();
    });

    it('should get locale picker', async () => {
      service.showLocalePicker = true;

      return expect(firstValueFrom(service.showLocalePicker$)).resolves.toBeTrue();
    });
  });

  describe('show theme picker', () => {
    it('should set theme picker', () => {
      expect(service['_showThemePicker$'].value).toBeTrue();

      service.showThemePicker = false;

      expect(service['_showThemePicker$'].value).toBeFalse();
    });

    it('should get theme picker', async () => {
      service.showThemePicker = true;

      return expect(firstValueFrom(service.showThemePicker$)).resolves.toBeTrue();
    });
  });
});
