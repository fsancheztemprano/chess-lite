import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { User } from '@chess-lite/domain';
import { UserManagementTableDatasource } from './user-management-table.datasource';

@Component({
  selector: 'chess-lite-user-management-table',
  templateUrl: './user-management-table.component.html',
  styleUrls: ['./user-management-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementTableComponent implements AfterViewInit {
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
    'expired',
    'credentialsExpired',
  ];

  constructor(public readonly dataSource: UserManagementTableDatasource) {}

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
