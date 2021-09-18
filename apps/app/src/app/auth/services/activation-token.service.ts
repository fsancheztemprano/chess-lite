import { Injectable } from '@angular/core';
import { AccountActivationInput, ActivationTokenRelations } from '@app/domain';
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

  public isAllowedToRequestToken(): Observable<boolean> {
    return this.halFormService.isAllowedTo(ActivationTokenRelations.REQUEST_ACTIVATION_TOKEN_REL);
  }

  public requestActivationToken(email: string): Observable<void> {
    return this.halFormService.rootResource.pipe(
      submitToTemplateOrThrowPipe(ActivationTokenRelations.REQUEST_ACTIVATION_TOKEN_REL, { email }),
    );
  }

  public getAccountActivationTemplate(): Observable<Template | null> {
    return this.halFormService.getTemplate(ActivationTokenRelations.ACTIVATE_ACCOUNT_REL);
  }

  public isAllowedToActivateAccount(): Observable<boolean> {
    return this.halFormService.isAllowedTo(ActivationTokenRelations.ACTIVATE_ACCOUNT_REL);
  }

  public activateAccount(accountActivation: AccountActivationInput) {
    return this.halFormService.rootResource.pipe(
      submitToTemplateOrThrowPipe(ActivationTokenRelations.ACTIVATE_ACCOUNT_REL, accountActivation),
    );
  }
}
