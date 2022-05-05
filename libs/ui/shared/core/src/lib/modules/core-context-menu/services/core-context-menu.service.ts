import { Injectable } from '@angular/core';
import { MenuData } from '@app/ui/shared/domain';
import { Observable } from 'rxjs';
import { CoreContextMenuRepository } from '../store/core-context-menu.repository';

@Injectable({
  providedIn: 'root',
})
export class CoreContextMenuService {
  constructor(private readonly coreContextMenuRepository: CoreContextMenuRepository) {}

  get options$(): Observable<MenuData[]> {
    return this.coreContextMenuRepository.coreContextMenuOptions$;
  }

  setOptions(options?: MenuData[]): void {
    this.coreContextMenuRepository.setOptions(options);
  }

  resetOptions(): void {
    this.coreContextMenuRepository.setOptions([]);
  }
}
