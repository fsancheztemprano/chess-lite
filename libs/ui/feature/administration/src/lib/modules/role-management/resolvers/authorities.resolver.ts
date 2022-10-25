import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Authority } from '@app/ui/shared/domain';
import { Observable } from 'rxjs';
import { AuthorityManagementService } from '../services/authority-management.service';

@Injectable({
  providedIn: 'root',
})
export class AuthoritiesResolver implements Resolve<Authority[]> {
  constructor(private readonly authorityManagementService: AuthorityManagementService) {}

  resolve(): Observable<Authority[]> {
    return this.authorityManagementService.getAllAuthorities();
  }
}
