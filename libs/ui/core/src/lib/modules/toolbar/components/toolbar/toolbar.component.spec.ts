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
  SidenavService,
  stubBreadcrumbServiceProvider,
  StubCoreContextMenuComponent,
  stubSidenavServiceProvider,
  ToolbarService,
} from '@app/ui/shared/core';
import { of } from 'rxjs';
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
  let toolbarService: ToolbarService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ToolbarComponent,
        StubThemePickerComponent,
        StubLocalePickerComponent,
        StubCoreContextMenuComponent,
        StubSearchBarComponent,
        StubBreadcrumbComponent,
        IsMobilePipe,
      ],
      imports: [NoopAnimationsModule, MatButtonModule, MatIconModule, MatToolbarModule, IsMobileModule],
      providers: [IsMobilePipe, stubSidenavServiceProvider, stubBreadcrumbServiceProvider],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    toolbarService = TestBed.inject(ToolbarService);
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('should render breadcrumb', () => {
    expect(fixture.debugElement.query(By.css('app-breadcrumb'))).toBeTruthy();
  });

  it('should render search bar', () => {
    expect(fixture.debugElement.query(By.css('app-search-bar'))).toBeTruthy();
  });

  it('should not render locale picker', () => {
    toolbarService.setShowLocalePicker(false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-locale-picker'))).toBeFalsy();
  });

  it('should render locale picker', () => {
    toolbarService.setShowLocalePicker(true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-locale-picker'))).toBeTruthy();
  });

  it('should not render theme picker', () => {
    toolbarService.setShowThemePicker(false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-theme-picker'))).toBeFalsy();
  });

  it('should render theme picker', () => {
    toolbarService.setShowThemePicker(true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-theme-picker'))).toBeTruthy();
  });

  it('should not render core context menu', () => {
    toolbarService.setShowContextMenu(false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-core-context-menu'))).toBeFalsy();
  });

  it('should render core context menu on mobile view', () => {
    jest.spyOn(TestBed.inject(IsMobileService), 'isMobile$', 'get').mockReturnValue(of(true));
    toolbarService.setShowContextMenu(true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-core-context-menu'))).toBeTruthy();
  });

  it('should toggle sidenav service', () => {
    const sidenavService = TestBed.inject(SidenavService);
    const sidenavToggleSpy = jest.spyOn(sidenavService, 'toggle');

    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();

    expect(sidenavToggleSpy).toHaveBeenCalled();
  });
});
