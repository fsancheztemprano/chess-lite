import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CoreCardViewModule, FormErrorModule } from '@app/ui/shared/common';
import { TranslocoModule } from '@ngneat/transloco';
import { UserManagementCreateComponent } from './components/user-management-create/user-management-create.component';
import { UserManagementCreateRoutingModule } from './user-management-create-routing.module';

@NgModule({
  declarations: [UserManagementCreateComponent],
  imports: [
    CommonModule,
    UserManagementCreateRoutingModule,
    MatInputModule,
    ReactiveFormsModule,
    FormErrorModule,
    MatCheckboxModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    CoreCardViewModule,
    TranslocoModule,
  ],
})
export class UserManagementCreateModule {}
