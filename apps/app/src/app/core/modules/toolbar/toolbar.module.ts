import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { IsMobileModule } from '../../../shared/modules/is-mobile/is-mobile.module';
import { ContextMenuModule } from '../context-menu/context-menu.module';
import { LocalePickerComponent } from './components/locale-picker/locale-picker.component';
import { ThemePickerComponent } from './components/theme-picker/theme-picker.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

@NgModule({
  declarations: [ThemePickerComponent, LocalePickerComponent, ToolbarComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    ContextMenuModule,
    IsMobileModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatMenuModule,
    TranslateModule,
  ],
  exports: [ToolbarComponent],
})
export class ToolbarModule {}
