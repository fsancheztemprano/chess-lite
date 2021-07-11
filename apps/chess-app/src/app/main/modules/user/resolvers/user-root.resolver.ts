import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Resource } from '@chess-lite/hal-form-client';
import { Observable } from 'rxjs';
import { UserRootService } from '../services/user-root.service';

@Injectable({
  providedIn: 'root',
})
export class UserRootResolver implements Resolve<Resource> {
  constructor(private readonly userRootService: UserRootService) {}

  resolve(): Observable<Resource> {
    return this.userRootService.initialize();
  }
}
