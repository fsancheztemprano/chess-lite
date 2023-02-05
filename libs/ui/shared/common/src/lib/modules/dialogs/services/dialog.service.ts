import { ComponentType } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { defer, Observable, switchMap } from 'rxjs';
import { ConfirmationDialogData, DialogType, InformationDialogData, InputDialogData } from '../model/dialogs.model';

@Injectable()
export class DialogService {
  constructor(private readonly dialog: MatDialog) {}

  private static async _loadDialog<T = unknown>(name: DialogType | string): Promise<ComponentType<T>> {
    const chunk = await import(`../modules/${name}-dialog/${name}-dialog.component`);
    return Object.values(chunk)[0] as ComponentType<T>;
  }

  public openConfirmationDialog(data: ConfirmationDialogData): Observable<boolean> {
    return defer(() => DialogService._loadDialog(DialogType.CONFIRMATION)).pipe(
      switchMap((dialogComponent) => this.dialog.open(dialogComponent, { data }).afterClosed()),
    );
  }

  public openInformationDialog(data: InformationDialogData): Observable<void> {
    return defer(() => DialogService._loadDialog(DialogType.INFORMATION)).pipe(
      switchMap((dialogComponent) => this.dialog.open(dialogComponent, { data }).afterClosed()),
    );
  }

  /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
  public openInputDialog(data: InputDialogData): Observable<any> {
    return defer(() => DialogService._loadDialog(DialogType.INPUT)).pipe(
      switchMap((dialogComponent) => this.dialog.open(dialogComponent, { data }).afterClosed()),
    );
  }
}
