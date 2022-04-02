import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { CoreService, MenuOption } from '@app/ui/shared/core';
import { User, UserManagementRelations, UserPage } from '@app/ui/shared/domain';
import { map } from 'rxjs/operators';
import { UserManagementTableDatasource } from './user-management-table.datasource';

@Component({
  selector: 'app-user-management-table',
  templateUrl: './user-management-table.component.html',
  styleUrls: ['./user-management-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementTableComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<User>;

  displayedColumns = [
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

  private createUserMenuOption: MenuOption = {
    label: 'New User',
    icon: 'person_add',
    callback: () => this.router.navigate(['administration', 'user-management', 'create']),
    disabled: this.dataSource.userPage$.pipe(
      map((userPage: UserPage) => !userPage.isAllowedTo(UserManagementRelations.USER_CREATE_REL)),
    ),
  };

  constructor(
    public readonly dataSource: UserManagementTableDatasource,
    private readonly coreService: CoreService,
    private readonly router: Router,
  ) {
    this.coreService.setCardViewHeader({ title: 'User Management' });
    this.coreService.setShowContextMenu(true);
    this.coreService.setContextMenuOptions([this.createUserMenuOption]);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  ngOnDestroy(): void {
    this.coreService.reset();
  }
}
