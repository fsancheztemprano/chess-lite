import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IsMobileModule } from '../../../../../shared/modules/is-mobile/is-mobile.module';
import { stubSidenavServiceProvider } from '../../../../services/sidenav.service.stub';
import { StubContextMenuComponent } from '../../../context-menu/components/context-menu/context-menu.component.stub';
import { stubToolbarServiceProvider } from '../../services/toolbar.service.stub';
import { LocalePickerComponent } from '../locale-picker/locale-picker.component';
import { ThemePickerComponent } from '../theme-picker/theme-picker.component';
import { ToolbarComponent } from './toolbar.component';

@Component({ selector: 'app-theme-picker', template: '' })
class StubThemePickerComponent implements Partial<ThemePickerComponent> {}

@Component({ selector: 'app-locale-picker', template: '' })
class StubLocalePickerComponent implements Partial<LocalePickerComponent> {}

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ToolbarComponent, StubThemePickerComponent, StubLocalePickerComponent, StubContextMenuComponent],
        imports: [NoopAnimationsModule, MatButtonModule, MatIconModule, MatToolbarModule, IsMobileModule],
        providers: [stubToolbarServiceProvider, stubSidenavServiceProvider],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
