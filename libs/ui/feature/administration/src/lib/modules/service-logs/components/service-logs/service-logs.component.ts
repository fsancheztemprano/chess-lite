import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from '@app/ui/shared/core';
import { AdministrationRelations, ServiceLogs } from '@app/ui/shared/domain';
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
  public serviceLogs: BehaviorSubject<ServiceLogs> = new BehaviorSubject<ServiceLogs>({} as ServiceLogs);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly serviceLogsService: ServiceLogsService,
    private readonly coreService: CoreService,
  ) {
    this.route.data.subscribe((data) => {
      this.serviceLogs.next(data.serviceLogs);
    });
    this.setHeader();
  }

  setServiceLogs(serviceLogs: ServiceLogs) {
    this.serviceLogs.next(serviceLogs);
  }

  ngOnDestroy(): void {
    this.coreService.reset();
    this.serviceLogs.complete();
  }

  private setHeader() {
    this.coreService.setCardViewHeader({
      title: 'Service Logs',
      showContextMenu: true,
    });
    this.coreService.setContextMenuOptions([
      {
        icon: 'refresh',
        label: 'Refresh',
        callback: () => this.refreshServiceLogs(),
      },
      {
        icon: 'delete',
        label: 'Delete',
        callback: () => this.deleteServiceLogs(),
        disabled: this.serviceLogs.pipe(
          map((serviceLogs) => !serviceLogs.hasTemplate(AdministrationRelations.DELETE_SERVICE_LOGS_REL)),
        ),
      },
    ]);
  }

  private refreshServiceLogs() {
    return this.serviceLogsService.getServiceLogs().subscribe((serviceLogs) => this.serviceLogs.next(serviceLogs));
  }

  private deleteServiceLogs() {
    return this.serviceLogsService.deleteServiceLogs(this.serviceLogs.value).subscribe((serviceLogs) => {
      this.serviceLogs.next(serviceLogs);
    });
  }
}
