import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToasterService } from '@app/ui/shared/app';
import { DialogService } from '@app/ui/shared/common';
import { CoreContextMenuService } from '@app/ui/shared/core';
import { Role, RoleManagementRelations, RolePage } from '@app/ui/shared/domain';
import { translate, TranslocoService } from '@ngneat/transloco';
import { EMPTY } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { RoleManagementTableDatasource } from './role-management-table.datasource';

@Component({
  selector: 'app-role-management-table',
  templateUrl: './role-management-table.component.html',
  styleUrls: ['./role-management-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleManagementTableComponent implements OnDestroy {
  public readonly TRANSLOCO_SCOPE = 'administration.role-management.table';
  public readonly displayedColumns: string[] = ['name', 'authorities', 'canLogin', 'coreRole', 'actions'];

  constructor(
    public readonly dataSource: RoleManagementTableDatasource,
    private readonly router: Router,
    private readonly toasterService: ToasterService,
    private readonly dialogService: DialogService,
    private readonly coreContextMenuService: CoreContextMenuService,
    private readonly translocoService: TranslocoService,
  ) {
    this.coreContextMenuService.show([
      {
        id: 'create-role-option',
        title$: this.translocoService.selectTranslate(`${this.TRANSLOCO_SCOPE}.context.add`),
        icon: 'add',
        callback: () => this.createRole(),
        disabled$: this.dataSource.rolePage$.pipe(
          map((rolePage: RolePage) => !rolePage.hasTemplate(RoleManagementRelations.ROLE_CREATE_REL)),
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

  @ViewChild(MatTable) set table(table: MatTable<Role> | undefined) {
    if (table) table.dataSource = this.dataSource;
  }

  ngOnDestroy(): void {
    this.coreContextMenuService.reset();
  }

  public deleteRole(role: Role): void {
    this.dialogService
      .openConfirmationDialog({
        title: translate(`${this.TRANSLOCO_SCOPE}.delete-dialog.title`),
        caption: translate(`${this.TRANSLOCO_SCOPE}.delete-dialog.caption`),
        acceptButton: {
          text: translate(`${this.TRANSLOCO_SCOPE}.delete-dialog.button.accept`),
          color: 'warn',
          disabled: !role.hasTemplate(RoleManagementRelations.ROLE_DELETE_REL),
        },
        dismissButton: {
          text: translate(`${this.TRANSLOCO_SCOPE}.delete-dialog.button.reject`),
        },
      })
      .pipe(switchMap((confirmRemoveRole) => (confirmRemoveRole ? this.dataSource.deleteRole(role) : EMPTY)))
      .subscribe(() =>
        this.toasterService.showToast({ title: translate(`${this.TRANSLOCO_SCOPE}.delete-dialog.toast`) }),
      );
  }

  private createRole(): void {
    this.dataSource.rolePage$
      .pipe(
        first(),
        switchMap((rolePage: RolePage) =>
          this.dialogService
            .openInputDialog({
              title: translate(`${this.TRANSLOCO_SCOPE}.create-dialog.title`),
              caption: translate(`${this.TRANSLOCO_SCOPE}.create-dialog.caption`),
              acceptButton: {
                text: translate(`${this.TRANSLOCO_SCOPE}.create-dialog.button.accept`),
                color: 'primary',
                disabled: !rolePage.hasTemplate(RoleManagementRelations.ROLE_CREATE_REL),
              },
              dismissButton: {
                text: translate(`${this.TRANSLOCO_SCOPE}.create-dialog.button.reject`),
              },
              template: rolePage.getTemplate(RoleManagementRelations.ROLE_CREATE_REL),
              inputs: [
                {
                  id: 'role-name-input',
                  key: 'name',
                  options: {
                    label: translate(`${this.TRANSLOCO_SCOPE}.create-dialog.input.name.label`),
                    placeholder: translate(`${this.TRANSLOCO_SCOPE}.create-dialog.input.name.placeholder`),
                  },
                },
              ],
            })
            .pipe(
              switchMap((body: { name: string }) =>
                body?.name?.length ? this.dataSource.createRole(body.name) : EMPTY,
              ),
            ),
        ),
      )
      .subscribe((newRole) => {
        this.toasterService.showToast({ title: translate(`${this.TRANSLOCO_SCOPE}.create-dialog.toast`) });
        this.router.navigate([`/administration/role-management/${newRole.id}`]);
      });
  }
}
