import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { User } from '@app/domain';
import { filter, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserManagementDetailService } from '../services/user-management-detail.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagementDetailResolver implements Resolve<User> {
  constructor(private readonly userManagementDetailService: UserManagementDetailService) {}

  resolve(): Observable<User> {
    return this.userManagementDetailService.getUser().pipe(
      filter((user) => !!user?.username?.length),
      first(),
    );
  }
}
