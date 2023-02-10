import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { BuildInfo } from '@app/ui/shared/domain';
import { Observable } from 'rxjs';
import { BuildInfoService } from '../services/build-info.service';

@Injectable({ providedIn: 'root' })
export class BuildInfoResolver implements Resolve<BuildInfo> {
  constructor(private readonly buildInfoService: BuildInfoService) {}

  resolve(): Observable<BuildInfo> {
    return this.buildInfoService.getBuildInfo();
  }
}
