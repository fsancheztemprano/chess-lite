import { Injectable } from '@angular/core';
import { AccountActivationInput, ActivationTokenRelations } from '@app/ui/shared/domain';
import { affordTemplate, HalFormService, Template } from '@hal-form-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActivationTokenService {
  constructor(private readonly halFormService: HalFormService) {}

  public getRequestActivationTokenTemplate(): Observable<Template | null> {
    return this.halFormService.getTemplate(ActivationTokenRelations.REQUEST_ACTIVATION_TOKEN_REL);
  }

  public hasTemplateToRequestToken(): Observable<boolean> {
    return this.halFormService.hasTemplate(ActivationTokenRelations.REQUEST_ACTIVATION_TOKEN_REL);
  }

  public requestActivationToken(email: string): Observable<unknown> {
    return this.halFormService.resource$.pipe(
      affordTemplate({ template: ActivationTokenRelations.REQUEST_ACTIVATION_TOKEN_REL, body: { email } }),
    );
  }

  public hasTemplateToActivateAccount(): Observable<boolean> {
    return this.halFormService.hasTemplate(ActivationTokenRelations.ACTIVATE_ACCOUNT_REL);
  }

  public getActivateAccountTemplate(): Observable<Template | null> {
    return this.halFormService.getTemplate(ActivationTokenRelations.ACTIVATE_ACCOUNT_REL);
  }

  public activateAccount(body: AccountActivationInput) {
    return this.halFormService.resource$.pipe(
      affordTemplate({ template: ActivationTokenRelations.ACTIVATE_ACCOUNT_REL, body }),
    );
  }
}
