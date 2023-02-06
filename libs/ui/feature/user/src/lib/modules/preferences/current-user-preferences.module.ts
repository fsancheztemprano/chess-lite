import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
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
