import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '@app/ui/shared/app';
import { setTemplateValidatorsPipe } from '@app/ui/shared/common';
import { translate } from '@ngneat/transloco';
import { bounceOutAnimation, wobbleAnimation } from 'angular-animations';
import { first } from 'rxjs/operators';
import { ActivationTokenService } from '../../../../services/activation-token.service';

@Component({
  selector: 'app-token-request',
  templateUrl: './token-request.component.html',
  styleUrls: ['./token-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [wobbleAnimation(), bounceOutAnimation()],
})
export class TokenRequestComponent {
  public form = new FormGroup({
    email: new FormControl(''),
  });

  public success = false;
  public error = false;
  public readonly TRANSLOCO_SCOPE = 'authentication.token-request';

  constructor(
    public readonly activationTokenService: ActivationTokenService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly toasterService: ToasterService,
  ) {
    this.activationTokenService
      .getRequestActivationTokenTemplate()
      .pipe(first(), setTemplateValidatorsPipe(this.form))
      .subscribe();
  }

  onSubmit() {
    this.activationTokenService.requestActivationToken(this.form.value.email).subscribe({
      next: () => this.setStatus(true),
      error: () => this.setStatus(false),
    });
  }

  onSuccess() {
    if (this.success) {
      this.router.navigate(['/auth', 'activate']);
    }
  }

  private setStatus(status: boolean) {
    if (status) {
      this.toasterService.showToast({
        title: translate(`${this.TRANSLOCO_SCOPE}.toast.title`),
        message: translate(`${this.TRANSLOCO_SCOPE}.toast.message`),
      });
    } else {
      this.toasterService.showErrorToast({
        title: translate(`${this.TRANSLOCO_SCOPE}.toast.error`),
      });
    }
    this.success = status;
    this.error = !status;
    this.cdr.markForCheck();
  }
}
