import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { User, UserManagementRelations, UserPage } from '@app/domain';
import { BehaviorSubject, combineLatest, Observable, startWith, tap, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserManagementService } from '../../../../services/user-management.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagementTableDatasource extends DataSource<User> {
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  private _userPage$: BehaviorSubject<UserPage> = new BehaviorSubject<UserPage>(new UserPage({}));

  constructor(private readonly userManagementService: UserManagementService) {
    super();
  }

  connect(): Observable<User[]> {
    return this.paginator && this.sort
      ? combineLatest([
          this.paginator.page.pipe(
            startWith({
              pageIndex: this.paginator.pageIndex,
              paseSize: this.paginator.pageSize,
            } as unknown as PageEvent),
          ),
          this.sort.sortChange.pipe(
            startWith({
              active: 'username',
              direction: 'asc',
            } as Sort),
          ),
        ]).pipe(
          switchMap(([page, sort]: [PageEvent, Sort]) => {
            return this.userManagementService.findUsers({
              page: page.pageIndex,
              size: page.pageSize,
              sort: `${sort.active},${sort.direction}`,
            });
          }),
          tap((userPage: UserPage) => this._userPage$.next(userPage)),
          map(
            (userPage: UserPage) => userPage.getEmbeddedCollection(UserManagementRelations.USER_MODEL_LIST_REL) || [],
          ),
        )
      : throwError(() => 'Please set the paginator and sort on the data source before connecting.');
  }

  get userPage$(): Observable<UserPage> {
    return this._userPage$.asObservable();
  }

  disconnect(): void {
    //noop
  }
}
