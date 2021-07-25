import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Page, User, UserPage } from '@chess-lite/domain';
import { combineLatest, Observable, startWith, tap, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserManagementService } from '../../../../services/user-management.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagementTableDatasource extends DataSource<User> {
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  page: Page | undefined;

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
          tap((userPage: UserPage) => (this.page = userPage.page)),
          map((userPage: UserPage) => userPage.userModelList),
        )
      : throwError(() => 'Please set the paginator and sort on the data source before connecting.');
  }

  disconnect(): void {
    //noop
  }
}
