import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import {
  Role,
  RoleChangedMessage,
  RoleChangedMessageAction,
  RoleManagementRelations,
  RolePage,
  RolesListChangedMessageDestination,
} from '@app/domain';
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
import { SearchService } from '../../../../../../../../core/modules/toolbar/services/search.service';
import { MessageService } from '../../../../../../../../core/services/message.service';
import { ToasterService } from '../../../../../../../../core/services/toaster.service';
import { RoleManagementService } from '../../../../services/role-management.service';

@Injectable({
  providedIn: 'root',
})
export class RoleManagementTableDatasource extends DataSource<Role> {
  public paginator: MatPaginator | undefined;
  public sort: MatSort | undefined;
  private _rolePage$: BehaviorSubject<RolePage> = new BehaviorSubject<RolePage>(new RolePage({}));
  private _roleListChanges: Subject<void> = new Subject();

  private _roleListMessagesSubscription: Subscription = new Subscription();

  constructor(
    private readonly roleManagementService: RoleManagementService,
    private readonly messageService: MessageService,
    private readonly toasterService: ToasterService,
    private readonly searchService: SearchService,
  ) {
    super();
  }

  connect(): Observable<Role[]> {
    this.searchService.showSearchBar();
    this._subscribeToRoleListChanges();
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
              active: 'name',
              direction: 'asc',
            } as Sort),
          ),
          this.searchService.getSearchTerm().pipe(
            auditTime(300),
            finalize(() => this.searchService.reset()),
          ),
          this._roleListChanges.asObservable().pipe(startWith(null)),
        ]).pipe(
          switchMap(([page, sort, search]: [PageEvent, Sort, string, unknown]) => {
            return this.roleManagementService.fetchRoles({
              page: page.pageIndex,
              size: page.pageSize,
              sort: `${sort.active},${sort.direction}`,
              search: search,
            });
          }),
          tap((rolePage: RolePage) => this._rolePage$.next(rolePage)),
          map((rolePage: RolePage) =>
            rolePage.hasEmbeddedCollection(RoleManagementRelations.ROLE_MODEL_LIST_REL)
              ? rolePage.getEmbeddedCollection(RoleManagementRelations.ROLE_MODEL_LIST_REL)
              : [],
          ),
        )
      : throwError(() => 'Please set the paginator and sort on the data source before connecting.');
  }

  get rolePage$(): Observable<RolePage> {
    return this._rolePage$.asObservable();
  }

  disconnect(): void {
    this._rolePage$.next(new RolePage({}));
    this._roleListMessagesSubscription.unsubscribe();
  }

  private _subscribeToRoleListChanges() {
    this._roleListMessagesSubscription.unsubscribe();
    this._roleListMessagesSubscription = this.messageService
      .subscribeToMessages<RoleChangedMessage>(new RolesListChangedMessageDestination())
      .pipe(
        filter(
          (roleChangedEvent) =>
            roleChangedEvent.action === RoleChangedMessageAction.CREATED ||
            this._rolePage$.value._embedded.roleModels?.some((role) => roleChangedEvent.roleId === role.id) ||
            false,
        ),
      )
      .subscribe({
        next: () => {
          this.toasterService.showToast({ message: 'An update was received from the service.' });
          this._roleListChanges.next();
        },
      });
  }

  createRole(name: string) {
    return this.roleManagementService.createRole(this._rolePage$.value, name);
  }
}
