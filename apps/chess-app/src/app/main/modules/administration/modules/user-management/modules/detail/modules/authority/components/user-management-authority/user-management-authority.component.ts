import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@chess-lite/domain';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'chess-lite-user-management-authority',
  templateUrl: './user-management-authority.component.html',
  styleUrls: ['./user-management-authority.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementAuthorityComponent {
  private _user$: BehaviorSubject<User> = new BehaviorSubject<User>(new User({}));

  constructor(private readonly route: ActivatedRoute) {
    this.route.parent?.parent?.data.pipe(map((data) => data.user)).subscribe((user) => this._user$.next(user));
  }

  get user$(): Observable<User> {
    return this._user$.asObservable();
  }

  userChange(user: User) {
    this._user$.next(user);
  }
}
