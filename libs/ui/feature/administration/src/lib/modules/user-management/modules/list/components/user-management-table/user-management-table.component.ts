import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTable as MatTable } from '@angular/material/legacy-table';
import { CoreContextMenuService } from '@app/ui/shared/core';
import { User, UserManagementRelations, UserPage } from '@app/ui/shared/domain';
import { TranslocoService } from '@ngneat/transloco';
import { map } from 'rxjs/operators';
import { UserManagementTableDatasource } from './user-management-table.datasource';

@Component({
  selector: 'app-user-management-table',
  templateUrl: './user-management-table.component.html',
  styleUrls: ['./user-management-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementTableComponent implements OnDestroy {
  public readonly TRANSLOCO_SCOPE = 'administration.user-management.table';
  public readonly displayedColumns = [
    'username',
    'email',
    'firstname',
    'lastname',
    'lastLoginDateDisplay',
    'joinDate',
    'role',
    'active',
    'locked',
    'edit',
  ];

  constructor(
    public readonly dataSource: UserManagementTableDatasource,
    private readonly coreContextMenuService: CoreContextMenuService,
    private readonly translocoService: TranslocoService,
  ) {
    this.coreContextMenuService.show([
      {
        title$: this.translocoService.selectTranslate(`${this.TRANSLOCO_SCOPE}.context.add`),
        icon: 'person_add',
        route: ['/administration', 'user-management', 'create'],
        disabled$: this.dataSource.userPage$.pipe(
          map((userPage: UserPage) => !userPage.hasTemplate(UserManagementRelations.USER_CREATE_REL)),
        ),
      },
    ]);
  }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  @ViewChild(MatSort) set sort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  @ViewChild(MatTable) set table(table: MatTable<User> | undefined) {
    if (table) table.dataSource = this.dataSource;
  }

  ngOnDestroy(): void {
    this.coreContextMenuService.reset();
  }
}
