import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { IsMobileModule } from '@app/ui/shared/core';
import { SubscribeModule } from '@ngneat/subscribe';
import { TranslocoModule } from '@ngneat/transloco';
import { ContextMenuModule } from '../context-menu/context-menu.module';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { LocalePickerComponent } from './components/locale-picker/locale-picker.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ThemePickerComponent } from './components/theme-picker/theme-picker.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { Iso3166Pipe } from './pipes/iso3166.pipe';

@NgModule({
  declarations: [
    ThemePickerComponent,
    LocalePickerComponent,
    ToolbarComponent,
    SearchBarComponent,
    BreadcrumbComponent,
    Iso3166Pipe,
  ],
  imports: [
    CommonModule,
    TranslocoModule,
    MatToolbarModule,
    MatIconModule,
    ContextMenuModule,
    IsMobileModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    SubscribeModule,
    RouterModule,
  ],
  exports: [ToolbarComponent],
})
export class ToolbarModule {}
