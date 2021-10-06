import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import {
  User,
  UserChangedMessage,
  UserChangedMessageAction,
  UserManagementRelations,
  UserPage,
  UsersListChangedMessageDestination,
} from '@app/domain';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  Observable,
  startWith,
  Subject,
  Subscription,
  tap,
  throwError,
} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MessageService } from '../../../../../../../../core/services/message.service';
import { ToasterService } from '../../../../../../../../core/services/toaster.service';
import { UserManagementService } from '../../../../services/user-management.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagementTableDatasource extends DataSource<User> {
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  private _userPage$: BehaviorSubject<UserPage> = new BehaviorSubject<UserPage>(new UserPage({}));
  private _userListChanges: Subject<void> = new Subject();

  private _userListMessagesSubscription: Subscription = new Subscription();

  constructor(
    private readonly userManagementService: UserManagementService,
    private readonly messageService: MessageService,
    private readonly toasterService: ToasterService,
  ) {
    super();
  }

  connect(): Observable<User[]> {
    this._subscribeToUserListChanges();
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
          this._userListChanges.asObservable().pipe(startWith(null)),
        ]).pipe(
          switchMap(([page, sort]: [PageEvent, Sort, unknown]) => {
            return this.userManagementService.fetchUsers({
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
    this._userPage$.complete();
    this._userListMessagesSubscription.unsubscribe();
  }

  private _subscribeToUserListChanges() {
    this._userListMessagesSubscription.unsubscribe();
    this._userListMessagesSubscription = this.messageService
      .subscribeToMessages<UserChangedMessage>(new UsersListChangedMessageDestination())
      .pipe(
        filter((userChangedEvent) => userChangedEvent.action !== UserChangedMessageAction.CREATED),
        filter(
          (userChangedEvent) =>
            this._userPage$.value._embedded.userModels?.some((user) => userChangedEvent.userId === user.id) || false,
        ),
      )
      .subscribe({
        next: () => {
          this.toasterService.showToast({ message: 'An update was received from the service.' });
          this._userListChanges.next();
        },
      });
  }
}
