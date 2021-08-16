import { Injectable } from '@angular/core';
import { ToolbarService } from './toolbar.service';

@Injectable({ providedIn: 'root' })
export class StubToolbarService implements Partial<ToolbarService> {}

export const stubToolbarServiceProvider = {
  provide: ToolbarService,
  useClass: StubToolbarService,
};
