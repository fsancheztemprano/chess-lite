import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  IsMobileModule,
  IsMobilePipe,
  IsMobileService,
  NgLetModule,
  SidenavService,
  stubBreadcrumbServiceProvider,
  StubCoreContextMenuComponent,
  StubIsMobileService,
  stubIsMobileServiceProvider,
  stubSidenavServiceProvider,
} from '@app/ui/shared/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { LocalePickerComponent } from '../locale-picker/locale-picker.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { ThemePickerComponent } from '../theme-picker/theme-picker.component';
import { ToolbarComponent } from './toolbar.component';

@Component({ selector: 'app-theme-picker', template: '' })
class StubThemePickerComponent implements Partial<ThemePickerComponent> {}

@Component({ selector: 'app-locale-picker', template: '' })
class StubLocalePickerComponent implements Partial<LocalePickerComponent> {}

@Component({ selector: 'app-search-bar', template: '' })
class StubSearchBarComponent implements Partial<SearchBarComponent> {}

@Component({ selector: 'app-breadcrumb', template: '' })
class StubBreadcrumbComponent implements Partial<BreadcrumbComponent> {}

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let isMobileService: StubIsMobileService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ToolbarComponent,
        StubBreadcrumbComponent,
        StubSearchBarComponent,
        StubLocalePickerComponent,
        StubThemePickerComponent,
        StubCoreContextMenuComponent,
        IsMobilePipe,
      ],
      imports: [NoopAnimationsModule, MatButtonModule, MatIconModule, MatToolbarModule, IsMobileModule, NgLetModule],
      providers: [IsMobilePipe, stubSidenavServiceProvider, stubIsMobileServiceProvider, stubBreadcrumbServiceProvider],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    isMobileService = TestBed.inject(IsMobileService) as unknown as StubIsMobileService;
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidenav service', () => {
    const sidenavService = TestBed.inject(SidenavService);
    const sidenavToggleSpy = jest.spyOn(sidenavService, 'toggle');

    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button).toBeTruthy();
    button.nativeElement.click();

    expect(sidenavToggleSpy).toHaveBeenCalled();
  });

  describe('breadcrumbs', () => {
    it('should render breadcrumb', () => {
      component.breadcrumbService.showBreadCrumbs = true;
      isMobileService['isHandset'].next(false);

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('app-breadcrumb'))).toBeTruthy();
    });

    it('should not render breadcrumb', () => {
      component.breadcrumbService.showBreadCrumbs = false;

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('app-breadcrumb'))).toBeFalsy();
    });

    it('should not render breadcrumb on mobile with expanded search bar', () => {
      component.breadcrumbService.showBreadCrumbs = true;
      component.searchService.showSearchInput = true;
      isMobileService['isHandset'].next(true);

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('app-breadcrumb'))).toBeFalsy();
    });
  });

  describe('search bar', () => {
    it('should render search bar', () => {
      component.searchService.showSearchBar = true;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('app-search-bar'))).toBeTruthy();
    });

    it('should not render search bar', () => {
      component.searchService.showSearchBar = false;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('app-search-bar'))).toBeFalsy();
    });
  });

  describe('locale picker', () => {
    it('should not render locale picker', () => {
      component.toolbarService.showLocalePicker = false;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('app-locale-picker'))).toBeFalsy();
    });

    it('should render locale picker', () => {
      component.toolbarService.showLocalePicker = true;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('app-locale-picker'))).toBeTruthy();
    });
  });

  describe('theme picker', () => {
    it('should not render theme picker', () => {
      component.toolbarService.showThemePicker = false;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('app-theme-picker'))).toBeFalsy();
    });

    it('should render theme picker', () => {
      component.toolbarService.showThemePicker = true;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('app-theme-picker'))).toBeTruthy();
    });
  });

  describe('core context menu', () => {
    it('should not render core context menu', () => {
      isMobileService['isHandset'].next(false);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('app-core-context-menu'))).toBeFalsy();
    });

    it('should render core context menu on mobile view', () => {
      isMobileService['isHandset'].next(true);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('app-core-context-menu'))).toBeTruthy();
    });
  });
});
