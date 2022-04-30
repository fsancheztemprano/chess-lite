import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreContextMenuService } from '@app/ui/shared/core';
import { AdministrationRelations, ServiceLogs } from '@app/ui/shared/domain';
import { TranslocoService } from '@ngneat/transloco';
import { BehaviorSubject } from 'rxjs';
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
  public readonly serviceLogs: BehaviorSubject<ServiceLogs> = new BehaviorSubject<ServiceLogs>({} as ServiceLogs);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly serviceLogsService: ServiceLogsService,
    private readonly coreContextMenuService: CoreContextMenuService,
    private readonly translocoService: TranslocoService,
  ) {
    this.route.data.subscribe((data) => this.serviceLogs.next(data.serviceLogs));
    this.coreContextMenuService.setOptions([
      {
        icon: 'refresh',
        title$: this.translocoService.selectTranslate(`${this.TRANSLOCO_SCOPE}.context.refresh`),
        callback: () => this.refreshServiceLogs(),
      },
      {
        icon: 'delete',
        title$: this.translocoService.selectTranslate(`${this.TRANSLOCO_SCOPE}.context.delete`),
        callback: () => this.deleteServiceLogs(),
        disabled$: this.serviceLogs.pipe(
          map((serviceLogs) => !serviceLogs.hasTemplate(AdministrationRelations.DELETE_SERVICE_LOGS_REL)),
        ),
      },
    ]);
  }

  ngOnDestroy(): void {
    this.coreContextMenuService.resetOptions();
    this.serviceLogs.complete();
  }

  private refreshServiceLogs() {
    return this.serviceLogsService.getServiceLogs().subscribe((serviceLogs) => this.serviceLogs.next(serviceLogs));
  }

  private deleteServiceLogs() {
    return this.serviceLogsService
      .deleteServiceLogs(this.serviceLogs.value)
      .subscribe((serviceLogs) => this.serviceLogs.next(serviceLogs));
  }
}
