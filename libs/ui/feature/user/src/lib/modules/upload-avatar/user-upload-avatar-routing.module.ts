import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserUploadAvatarComponent } from './components/user-upload-avatar/user-upload-avatar.component';

const routes: Routes = [
  {
    path: '',
    component: UserUploadAvatarComponent,
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
