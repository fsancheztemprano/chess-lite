import { Injectable } from '@angular/core';
import { HalFormService } from '@chess-lite/hal-form-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppInitService {
  constructor(private readonly halFormService: HalFormService) {}

  init(): Observable<unknown> {
    return this.halFormService.initialize();
  }
}
