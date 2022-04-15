import { Injectable } from '@angular/core';
import { AccountActivationInput, ActivationTokenRelations } from '@app/ui/shared/domain';
import { HalFormService, submitToTemplateOrThrowPipe, Template } from '@hal-form-client';
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
    return this.halFormService
      .getResource()
      .pipe(submitToTemplateOrThrowPipe(ActivationTokenRelations.REQUEST_ACTIVATION_TOKEN_REL, { body: { email } }));
  }

  public hasTemplateToActivateAccount(): Observable<boolean> {
    return this.halFormService.hasTemplate(ActivationTokenRelations.ACTIVATE_ACCOUNT_REL);
  }

  public activateAccount(body: AccountActivationInput) {
    return this.halFormService
      .getResource()
      .pipe(submitToTemplateOrThrowPipe(ActivationTokenRelations.ACTIVATE_ACCOUNT_REL, { body }));
  }
}
