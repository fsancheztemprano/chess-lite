import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SubscribeModule } from '@ngneat/subscribe';
import { TranslateModule } from '@ngx-translate/core';
import { FormErrorModule } from '../../../../shared/modules/form-error/form-error.module';
import { CurrentUserPreferencesComponent } from './components/user-preferences/current-user-preferences.component';
import { CurrentUserPreferencesRoutingModule } from './current-user-preferences-routing.module';

@NgModule({
  declarations: [CurrentUserPreferencesComponent],
  imports: [
    CommonModule,
    CurrentUserPreferencesRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule,
    FormErrorModule,
    SubscribeModule,
  ],
})
export class CurrentUserPreferencesModule {}
