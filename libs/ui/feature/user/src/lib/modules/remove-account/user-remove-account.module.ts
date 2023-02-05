import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { CoreCardViewModule } from '@app/ui/shared/common';
import { NgLetModule } from '@app/ui/shared/core';
import { TranslocoModule } from '@ngneat/transloco';
import { UserRemoveAccountConfirmComponent } from './components/user-remove-account-confirm/user-remove-account-confirm.component';
import { UserRemoveAccountComponent } from './components/user-remove-account/user-remove-account.component';
import { UserRemoveAccountRoutingModule } from './user-remove-account-routing.module';

@NgModule({
  declarations: [UserRemoveAccountComponent, UserRemoveAccountConfirmComponent],
  imports: [
    CommonModule,
    UserRemoveAccountRoutingModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    NgLetModule,
    CoreCardViewModule,
    TranslocoModule,
  ],
})
export class UserRemoveAccountModule {}
