import { Injectable } from '@angular/core';
import { BuildInfo, BuildInfoRelations } from '@app/ui/shared/domain';
import { HalFormService } from '@hal-form-client';
import { Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BuildInfoService {
  constructor(private readonly halFormService: HalFormService) {}

  public getBuildInfo(): Observable<BuildInfo> {
    return this.halFormService
      .getLinkOrThrow(BuildInfoRelations.BUILD_INFO_REL)
      .pipe(switchMap((link) => link.followRaw<BuildInfo>()));
  }
}
