import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormErrorModule } from '@app/ui/shared/common';
import { AccountActivationRoutingModule } from './account-activation-routing.module';
import { AccountActivationComponent } from './components/account-activation/account-activation.component';

@NgModule({
  declarations: [AccountActivationComponent],
  imports: [
    CommonModule,
    AccountActivationRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    FormErrorModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class AccountActivationModule {}
