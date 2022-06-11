import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@app/ui/shared/app';
import { matchingControlsValidators } from '@app/ui/shared/common';
import { AccountActivationInput } from '@app/ui/shared/domain';
import { translate } from '@ngneat/transloco';
import { bounceOutAnimation, wobbleAnimation } from 'angular-animations';
import { ActivationTokenService } from '../../../../services/activation-token.service';

@Component({
  selector: 'app-account-activation',
  templateUrl: './account-activation.component.html',
  styleUrls: ['./account-activation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [wobbleAnimation(), bounceOutAnimation()],
})
export class AccountActivationComponent {
  public form = new FormGroup(
    {
      token: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
      password2: new FormControl(''),
    },
    [matchingControlsValidators('password', 'password2')],
  );
  public success = false;
  public error = false;
  public readonly TRANSLOCO_SCOPE = 'authentication.activation';

  constructor(
    public readonly activationTokenService: ActivationTokenService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly toasterService: ToasterService,
  ) {
    this.route.queryParams.subscribe((params) => this.form.patchValue(params));
  }

  onSuccess() {
    if (this.success) {
      this.router.navigate(['/auth', 'login']);
    }
  }

  onSubmit() {
    this.activationTokenService.activateAccount(this.form.value as AccountActivationInput).subscribe({
      next: () => this.setStatus(true),
      error: () => this.setStatus(false),
    });
  }

  private setStatus(status: boolean) {
    if (status) {
      this.toasterService.showToast({
        title: translate(`${this.TRANSLOCO_SCOPE}.toast.success.title`),
        message: translate(`${this.TRANSLOCO_SCOPE}.toast.success.message`),
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
