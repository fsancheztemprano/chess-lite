import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { User, UserPage } from '@chess-lite/domain';
import { Subject } from 'rxjs';
import { HeaderService, MenuOption } from '../../../../../../../../../core/services/header.service';
import { UserManagementTableDatasource } from './user-management-table.datasource';

@Component({
  selector: 'chess-lite-user-management-table',
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
    onClick: () => this.router.navigate(['administration', 'user-management', 'create']),
    disabled: new Subject<boolean>(),
  };

  constructor(
    public readonly dataSource: UserManagementTableDatasource,
    private readonly headerService: HeaderService,
    private readonly router: Router,
  ) {
    this.headerService.setHeader({
      title: 'User Management',
      showOptionsButton: true,
      options: [this.createUserMenuOption],
    });
    this.dataSource.userPage$.subscribe((userPage: UserPage) =>
      this.createUserMenuOption.disabled?.next(!userPage.isAllowedTo('create')),
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  ngOnDestroy(): void {
    this.headerService.resetHeader();
  }
}
