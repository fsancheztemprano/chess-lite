import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToasterService } from '@app/ui/shared/app';
import { ConfirmationDialogService, TextInputDialogService } from '@app/ui/shared/common';
import { CoreService } from '@app/ui/shared/core';
import { MenuData, Role, RoleManagementRelations, RolePage } from '@app/ui/shared/domain';
import { EMPTY, tap } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { RoleManagementTableDatasource } from './role-management-table.datasource';

@Component({
  selector: 'app-role-management-table',
  templateUrl: './role-management-table.component.html',
  styleUrls: ['./role-management-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleManagementTableComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Role>;

  displayedColumns: string[] = ['name', 'authorities', 'canLogin', 'coreRole', 'actions'];

  private createRoleMenuOption: MenuData = {
    title: 'New Role',
    icon: 'add',
    callback: () => this.createRole(),
    disabled$: this.dataSource.rolePage$.pipe(
      map((rolePage: RolePage) => !rolePage.hasTemplate(RoleManagementRelations.ROLE_CREATE_REL)),
    ),
  };

  constructor(
    public readonly dataSource: RoleManagementTableDatasource,
    private readonly coreService: CoreService,
    private readonly router: Router,
    private readonly toasterService: ToasterService,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly textInputDialogService: TextInputDialogService,
  ) {
    this.coreService.setCardViewHeader({ title: 'Role Management' });
    this.coreService.setShowContextMenu(true);
    this.coreService.setContextMenuOptions([this.createRoleMenuOption]);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  ngOnDestroy(): void {
    this.coreService.reset();
  }

  deleteRole(role: Role) {
    this.confirmationDialogService
      .openDialog({
        title: 'Remove Role',
        caption: 'Do you really want to remove this role? Users with this role will get the default role.',
        acceptButton: {
          text: 'REMOVE ROLE',
          color: 'warn',
          disabled: !role.hasTemplate(RoleManagementRelations.ROLE_DELETE_REL),
        },
      })
      .pipe(switchMap((confirmRemoveRole) => (confirmRemoveRole ? this.dataSource.deleteRole(role) : EMPTY)))
      .subscribe({
        next: () => this.toasterService.showToast({ title: 'Role deleted successfully' }),
        error: () => this.toasterService.showErrorToast({ title: 'An error has occurred' }),
      });
  }

  private createRole() {
    return this.dataSource.rolePage$
      .pipe(
        first(),
        switchMap((rolePage: RolePage) => {
          return this.textInputDialogService
            .openDialog({
              title: 'Create Role',
              caption: 'Enter a name for the new Role',
              acceptButton: {
                text: 'CREATE ROLE',
                color: 'primary',
                disabled: !rolePage.hasTemplate(RoleManagementRelations.ROLE_CREATE_REL),
              },
              template: rolePage.getTemplate(RoleManagementRelations.ROLE_CREATE_REL),
              inputs: [
                {
                  key: 'name',
                  options: {
                    label: 'Role Name',
                    placeholder: 'ROLE_SUPER_USER',
                  },
                },
              ],
            })
            .pipe(
              switchMap((body: { name: string }) => {
                return body?.name?.length ? this.dataSource.createRole(body.name) : EMPTY;
              }),
            );
        }),
        tap({
          next: () => this.toasterService.showToast({ title: 'Role Created successfully' }),
          error: () => this.toasterService.showErrorToast({ title: 'An error has occurred' }),
        }),
      )
      .subscribe();
  }
}
