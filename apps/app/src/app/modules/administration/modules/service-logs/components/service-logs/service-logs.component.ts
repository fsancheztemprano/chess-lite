import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceLogs } from '@app/domain';
import { CoreService } from '../../../../../../core/services/core.service';
import { ServiceLogsService } from '../../services/service-logs.service';

@Component({
  selector: 'app-service-logs',
  templateUrl: './service-logs.component.html',
  styleUrls: ['./service-logs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceLogsComponent {
  public serviceLogs?: ServiceLogs;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly serviceLogsService: ServiceLogsService,
    private readonly coreService: CoreService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.route.data.subscribe((data) => {
      this.serviceLogs = data.serviceLogs;
    });
    this.setHeader();
  }

  private setHeader() {
    this.coreService.setHeader({
      title: 'Service Logs',
      showContextMenu: true,
      options: [
        {
          icon: 'refresh',
          label: 'Refresh',
          onClick: () => this.refreshServiceLogs(),
        },
      ],
    });
  }

  private refreshServiceLogs() {
    return this.serviceLogsService.getServiceLogs().subscribe((serviceLogs) => {
      this.serviceLogs = serviceLogs;
      this.cdr.markForCheck();
    });
  }
}
