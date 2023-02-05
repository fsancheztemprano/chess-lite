import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { CoreCardViewModule, FormErrorModule } from '@app/ui/shared/common';
import { SubscribeDirective } from '@ngneat/subscribe';
import { TranslocoModule } from '@ngneat/transloco';
import { CurrentUserPreferencesComponent } from './components/user-preferences/current-user-preferences.component';
import { CurrentUserPreferencesRoutingModule } from './current-user-preferences-routing.module';

@NgModule({
  declarations: [CurrentUserPreferencesComponent],
  imports: [
    CommonModule,
    CurrentUserPreferencesRoutingModule,
    ReactiveFormsModule,
    TranslocoModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule,
    FormErrorModule,
    SubscribeDirective,
    CoreCardViewModule,
    TranslocoModule,
  ],
})
export class CurrentUserPreferencesModule {}
