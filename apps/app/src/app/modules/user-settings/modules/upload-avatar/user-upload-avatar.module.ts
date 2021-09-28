import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormErrorModule } from '../../../../shared/modules/form-error/form-error.module';
import { NgLetModule } from '../../../../shared/modules/ng-let/ng-let.module';
import { UserUploadAvatarComponent } from './components/user-upload-avatar/user-upload-avatar.component';
import { UserUploadAvatarRoutingModule } from './user-upload-avatar-routing.module';

@NgModule({
  declarations: [UserUploadAvatarComponent],
  imports: [
    CommonModule,
    UserUploadAvatarRoutingModule,
    FormErrorModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NgLetModule,
  ],
})
export class UserUploadAvatarModule {}
