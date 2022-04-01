import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StubDialogService {
  openDialog = () => of(true);
}

export function getStubbedDialogService(service: unknown) {
  return {
    provide: service,
    useClass: StubDialogService,
  };
}
