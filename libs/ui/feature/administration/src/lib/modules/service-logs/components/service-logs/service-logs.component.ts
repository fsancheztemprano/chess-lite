import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreContextMenuService } from '@app/ui/shared/core';
import { AdministrationRelations, ServiceLogs } from '@app/ui/shared/domain';
import { TranslocoService } from '@ngneat/transloco';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceLogsService } from '../../services/service-logs.service';

@Component({
  selector: 'app-service-logs',
  templateUrl: './service-logs.component.html',
  styleUrls: ['./service-logs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceLogsComponent implements OnDestroy {
  public readonly TRANSLOCO_SCOPE = 'administration.service-logs';
  private readonly _serviceLogs: BehaviorSubject<ServiceLogs> = new BehaviorSubject<ServiceLogs>({} as ServiceLogs);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly serviceLogsService: ServiceLogsService,
    private readonly coreContextMenuService: CoreContextMenuService,
    private readonly translocoService: TranslocoService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.route.data.subscribe(({ serviceLogs }) => this.setServiceLogs(serviceLogs));
    this.coreContextMenuService.show([
      {
        id: 'refresh-service-logs-option',
        icon: 'refresh',
        title$: this.translocoService.selectTranslate(`${this.TRANSLOCO_SCOPE}.context.refresh`),
        callback: () => this.refreshServiceLogs(),
      },
      {
        id: 'delete-service-logs-option',
        icon: 'delete',
        title$: this.translocoService.selectTranslate(`${this.TRANSLOCO_SCOPE}.context.delete`),
        callback: () => this.deleteServiceLogs(),
        disabled$: this._serviceLogs.pipe(
          map((serviceLogs) => !serviceLogs.hasTemplate(AdministrationRelations.DELETE_SERVICE_LOGS_REL)),
        ),
      },
    ]);
  }

  ngOnDestroy(): void {
    this.coreContextMenuService.reset();
    this._serviceLogs.complete();
  }

  private refreshServiceLogs() {
    return this.serviceLogsService.getServiceLogs().subscribe((serviceLogs) => this.setServiceLogs(serviceLogs));
  }

  private deleteServiceLogs() {
    return this.serviceLogsService
      .deleteServiceLogs(this._serviceLogs.value)
      .subscribe((serviceLogs) => this.setServiceLogs(serviceLogs));
  }

  setServiceLogs(serviceLogs: ServiceLogs) {
    this._serviceLogs.next(serviceLogs);
    this.cdr.markForCheck();
  }

  getServiceLogs$(): Observable<ServiceLogs> {
    return this._serviceLogs;
  }
}
