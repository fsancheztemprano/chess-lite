import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  IsMobileModule,
  stubBreadcrumbServiceProvider,
  StubCoreContextMenuComponent,
  stubSidenavServiceProvider,
  stubToolbarServiceProvider,
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

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ToolbarComponent,
        StubThemePickerComponent,
        StubLocalePickerComponent,
        StubCoreContextMenuComponent,
        StubSearchBarComponent,
        StubBreadcrumbComponent,
      ],
      imports: [NoopAnimationsModule, MatButtonModule, MatIconModule, MatToolbarModule, IsMobileModule],
      providers: [stubToolbarServiceProvider, stubSidenavServiceProvider, stubBreadcrumbServiceProvider],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
