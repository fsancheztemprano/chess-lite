import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserRootService } from '../services/user-root.service';

@Injectable({
  providedIn: 'root',
})
export class UserRootGuard implements CanLoad {
  constructor(private readonly userRootService: UserRootService) {}

  canLoad(): Observable<boolean> {
    return this.userRootService.initialize().pipe(map((resources) => !!resources));
  }
}
