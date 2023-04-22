import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ThemeModel } from '@app/ui/shared/domain';
import { HalFormClientTestingModule, HalFormService } from '@hal-form-client';
import { noop } from 'rxjs';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientTestingModule],
    });
    service = TestBed.inject(ThemeService);
    http = TestBed.inject(HttpTestingController);
    TestBed.inject(HalFormService).setResource({
      _links: {
        self: { href: '/api' },
        theme: { href: '/api/theme' },
      },
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get theme', () => {
    const mockTheme = {
      primaryColor: '#00FFFF',
    };
    service.getTheme().subscribe((theme) => {
      expect(theme).toEqual(mockTheme);
    });
    const testRequest = http.expectOne('/api/theme');
    expect(testRequest.request.method).toEqual('GET');
    testRequest.flush(mockTheme);
  });

  it('should update theme', () => {
    const mockTheme = {
      primaryColor: '#00FFFF',
    };
    const themeResource = new ThemeModel({
      primaryColor: '#00FFFF',
      _templates: {
        update: { method: 'PATCH', target: '/api/theme' },
      },
    });
    service.updateTheme(themeResource, mockTheme).subscribe((theme) => {
      expect(theme).toEqual(mockTheme);
    });
    const testRequest = http.expectOne('/api/theme');
    expect(testRequest.request.method).toEqual('PATCH');
    testRequest.flush(mockTheme);
  });

  it('should initialize app colors with theme', () => {
    const updateAppColorsSpy = jest.spyOn(service, 'updateAppColors').mockImplementationOnce(noop);
    const mockTheme = {
      primaryColor: '#00FFFF',
    };
    service.initializeTheme().subscribe((theme) => {
      expect(theme).toEqual(mockTheme);
      expect(updateAppColorsSpy).toHaveBeenCalledTimes(1);
      expect(updateAppColorsSpy).toHaveBeenCalledWith(mockTheme);
    });
    const testRequest = http.expectOne('/api/theme');
    expect(testRequest.request.method).toEqual('GET');
    testRequest.flush(mockTheme);
  });

  it('should update app primary colors', () => {
    const documentSetPropertySpy = jest
      .spyOn(document.documentElement.style, 'setProperty')
      .mockImplementationOnce(noop);
    const mockTheme = {
      primaryColor: '#2196f3',
      accentColor: '#8bc34a',
      warnColor: '#f44336',
    };
    service.updateAppColors(mockTheme);
    expect(documentSetPropertySpy).toHaveBeenCalledTimes(84);
    expect(documentSetPropertySpy.mock.calls).toMatchSnapshot();
  });
});
