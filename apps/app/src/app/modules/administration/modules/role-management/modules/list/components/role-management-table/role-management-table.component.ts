import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { Role, RoleManagementRelations, RolePage } from '@app/domain';
import { EMPTY } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { MenuOption } from '../../../../../../../../core/modules/context-menu/services/context-menu.service.model';
import { CoreService } from '../../../../../../../../core/services/core.service';
import { ToasterService } from '../../../../../../../../core/services/toaster.service';
import { ConfirmationDialogService } from '../../../../../../../../shared/modules/dialogs/modules/confirmation-dialog/services/confirmation-dialog.service';
import { TextInputDialogService } from '../../../../../../../../shared/modules/dialogs/modules/input-dialog/modules/text-input-dialog/services/text-input-dialog.service';
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

  displayedColumns = ['name', 'authorities', 'coreRole', 'actions'];

  private createRoleMenuOption: MenuOption = {
    label: 'New Role',
    icon: 'add',
    onClick: () => this.createRole(),
    disabled: this.dataSource.rolePage$.pipe(
      map((rolePage: RolePage) => !rolePage.isAllowedTo(RoleManagementRelations.ROLE_CREATE_REL)),
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
          disabled: !role.isAllowedTo(RoleManagementRelations.ROLE_DELETE_REL),
        },
      })
      .pipe(
        switchMap((confirmRemoveRole) =>
          confirmRemoveRole ? role.submitToTemplateOrThrow(RoleManagementRelations.ROLE_DELETE_REL) : EMPTY,
        ),
      )
      .subscribe({
        next: () => this.toasterService.showToast({ title: 'Role deleted successfully' }),
        error: () => this.toasterService.showErrorToast({ title: 'An error has occurred' }),
      });
  }

  private createRole() {
    this.dataSource.rolePage$
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
                disabled: !rolePage.isAllowedTo(RoleManagementRelations.ROLE_CREATE_REL),
              },
              inputs: [
                {
                  key: 'name',
                  options: {
                    defaultValue: 'ROLE_',
                    label: 'Role Name',
                    placeholder: 'ROLE_SUPER_USER',
                  },
                },
              ],
            })
            .pipe(
              switchMap((dialogInputs) => {
                const name = dialogInputs?.find((input) => input.key === 'name')?.value || '';
                return name.length
                  ? rolePage.submitToTemplateOrThrow(RoleManagementRelations.ROLE_CREATE_REL, { name })
                  : EMPTY;
              }),
            );
        }),
      )
      .subscribe({
        next: () => this.toasterService.showToast({ title: 'Role Created successfully' }),
        error: () => this.toasterService.showErrorToast({ title: 'An error has occurred' }),
      });
  }
}
