import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CoreCardViewModule, FormErrorModule } from '@app/ui/shared/common';
import { TranslocoModule } from '@ngneat/transloco';
import { SignupComponent } from './components/signup/signup.component';
import { SignupRoutingModule } from './signup-routing.module';

@NgModule({
  declarations: [SignupComponent],
  imports: [
    CommonModule,
    SignupRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    FormErrorModule,
    MatInputModule,
    MatButtonModule,
    CoreCardViewModule,
    TranslocoModule,
  ],
})
export class SignupModule {}
