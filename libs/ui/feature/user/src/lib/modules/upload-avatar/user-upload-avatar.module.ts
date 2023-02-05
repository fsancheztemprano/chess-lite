import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatIconModule } from '@angular/material/icon';
import { CoreCardViewModule, FormErrorModule } from '@app/ui/shared/common';
import { NgLetModule } from '@app/ui/shared/core';
import { TranslocoModule } from '@ngneat/transloco';
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
    CoreCardViewModule,
    TranslocoModule,
  ],
})
export class UserUploadAvatarModule {}
