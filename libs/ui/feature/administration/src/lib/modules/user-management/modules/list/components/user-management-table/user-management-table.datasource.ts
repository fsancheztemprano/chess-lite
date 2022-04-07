import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MessageService } from '@app/ui/shared/app';
import { SearchService } from '@app/ui/shared/core';
import {
  User,
  UserChangedMessage,
  UserChangedMessageAction,
  UserManagementRelations,
  UserPage,
  WEBSOCKET_REL,
} from '@app/ui/shared/domain';
import {
  auditTime,
  BehaviorSubject,
  combineLatest,
  filter,
  finalize,
  Observable,
  startWith,
  Subject,
  Subscription,
  tap,
  throwError,
} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserManagementService } from '../../../../services/user-management.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagementTableDatasource extends DataSource<User> {
  public paginator: MatPaginator | undefined;
  public sort: MatSort | undefined;
  private _userPage$: BehaviorSubject<UserPage> = new BehaviorSubject<UserPage>(new UserPage({}));
  private _userListChanges: Subject<void> = new Subject();

  private _userListMessagesSubscription: Subscription = new Subscription();

  constructor(
    private readonly userManagementService: UserManagementService,
    private readonly messageService: MessageService,
    private readonly searchService: SearchService,
  ) {
    super();
  }

  connect(): Observable<User[]> {
    this.searchService.showSearchBar();
    return this.paginator && this.sort
      ? combineLatest([
          this.paginator.page.pipe(
            startWith({
              pageIndex: this.paginator.pageIndex,
              pageSize: this.paginator.pageSize,
            } as unknown as PageEvent),
          ),
          this.sort.sortChange.pipe(
            startWith({
              active: 'username',
              direction: 'asc',
            } as Sort),
          ),
          this.searchService.getSearchTerm().pipe(
            auditTime(300),
            finalize(() => this.searchService.reset()),
          ),
          this._userListChanges.asObservable().pipe(startWith(null)),
        ]).pipe(
          switchMap(([page, sort, search]: [PageEvent, Sort, string, unknown]) => {
            return this.userManagementService.fetchUsers({
              page: page.pageIndex,
              size: page.pageSize,
              sort: `${sort.active},${sort.direction}`,
              search: search,
            });
          }),
          tap((userPage: UserPage) => {
            this._userPage$.next(userPage);
            this._subscribeToUserPageChanges(userPage);
          }),
          map((userPage: UserPage) =>
            userPage.hasEmbeddedCollection(UserManagementRelations.USER_MODEL_LIST_REL)
              ? userPage.getEmbeddedCollection(UserManagementRelations.USER_MODEL_LIST_REL)
              : [],
          ),
        )
      : throwError(() => 'Please set the paginator and sort on the data source before connecting.');
  }

  get userPage$(): Observable<UserPage> {
    return this._userPage$.asObservable();
  }

  disconnect(): void {
    this._userPage$.complete();
    this._userListMessagesSubscription?.unsubscribe();
  }

  private _subscribeToUserPageChanges(userPage: UserPage) {
    if (
      (!this._userListMessagesSubscription || this._userListMessagesSubscription.closed) &&
      userPage.hasLink(WEBSOCKET_REL)
    ) {
      this._userListMessagesSubscription?.unsubscribe();
      this._userListMessagesSubscription = this.messageService
        .multicast<UserChangedMessage>(userPage.getLink(WEBSOCKET_REL)!.href)
        .pipe(
          filter((userChangedEvent) => userChangedEvent.action !== UserChangedMessageAction.CREATED),
          filter(
            (userChangedEvent) =>
              this._userPage$.value._embedded.userModels?.some((user) => userChangedEvent.userId === user.id) || false,
          ),
        )
        .subscribe(() => this._userListChanges.next());
    }
  }
}
