import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '@app/ui/shared/app';
import { setTemplateValidatorsPipe } from '@app/ui/shared/common';
import { translate } from '@ngneat/transloco';
import { first } from 'rxjs/operators';
import { ActivationTokenService } from '../../../../services/activation-token.service';

@Component({
  selector: 'app-token-request',
  templateUrl: './token-request.component.html',
  styleUrls: ['./token-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenRequestComponent {
  public readonly TRANSLOCO_SCOPE = 'authentication.token-request';
  public readonly form = new FormGroup({
    email: new FormControl(''),
  });

  constructor(
    public readonly activationTokenService: ActivationTokenService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly toasterService: ToasterService,
  ) {
    this.activationTokenService
      .getActivateAccountTemplate()
      .pipe(first(), setTemplateValidatorsPipe(this.form))
      .subscribe();
  }

  onSubmit() {
    this.activationTokenService.requestActivationToken(this.form.value.email as string).subscribe({
      next: () => {
        this.router.navigate(['/auth', 'activate']);
        this.toasterService.showToast({
          title: translate(`${this.TRANSLOCO_SCOPE}.toast.success.title`),
          message: translate(`${this.TRANSLOCO_SCOPE}.toast.success.message`),
        });
      },
      error: () => this.toasterService.showErrorToast({ title: translate(`${this.TRANSLOCO_SCOPE}.toast.error`) }),
    });
  }
}
