import { Injectable } from '@angular/core';
import { noop } from 'rxjs';
import { CardViewHeaderService } from './card-view-header.service';

@Injectable({ providedIn: 'root' })
export class StubCardViewHeaderService implements Partial<CardViewHeaderService> {
  setHeader = noop;
}

export const stubCardViewHeaderServiceProvider = {
  provide: CardViewHeaderService,
  useClass: StubCardViewHeaderService,
};
