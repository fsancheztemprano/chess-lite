import { Injectable } from '@angular/core';
import { MenuData } from '@app/ui/shared/domain';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StubCoreContextMenuRepository {
  public readonly coreContextMenuOptions$: BehaviorSubject<MenuData[]> = new BehaviorSubject<MenuData[]>([]);

  public setOptions(options?: MenuData[]): void {
    this.coreContextMenuOptions$.next(options || []);
  }
}
