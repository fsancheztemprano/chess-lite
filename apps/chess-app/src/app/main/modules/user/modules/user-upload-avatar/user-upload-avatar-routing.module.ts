import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentUserResolver } from '../../resolvers/current-user.resolver';
import { UserUploadAvatarComponent } from './components/user-upload-avatar/user-upload-avatar.component';

const routes: Routes = [
  {
    path: '',
    component: UserUploadAvatarComponent,
    resolve: { user: CurrentUserResolver },
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserUploadAvatarRoutingModule {}
