import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@app/ui/shared/app';
import { matchingControlsValidators } from '@app/ui/shared/common';
import { AccountActivationInput } from '@app/ui/shared/domain';
import { translate } from '@ngneat/transloco';
import { ActivationTokenService } from '../../../../services/activation-token.service';

@Component({
  selector: 'app-account-activation',
  templateUrl: './account-activation.component.html',
  styleUrls: ['./account-activation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountActivationComponent {
  public readonly TRANSLOCO_SCOPE = 'authentication.activation';
  public readonly form = new FormGroup(
    {
      token: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
      password2: new FormControl(''),
    },
    [matchingControlsValidators('password', 'password2')],
  );

  constructor(
    public readonly activationTokenService: ActivationTokenService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly toasterService: ToasterService,
  ) {
    this.route.queryParams.subscribe((params) => this.form.patchValue(params));
  }

  onSubmit() {
    this.activationTokenService.activateAccount(this.form.value as AccountActivationInput).subscribe({
      next: () => {
        this.router.navigate(['/auth', 'login']);
        this.toasterService.showToast({
          title: translate(`${this.TRANSLOCO_SCOPE}.toast.success.title`),
          message: translate(`${this.TRANSLOCO_SCOPE}.toast.success.message`),
        });
      },
      error: () => this.toasterService.showErrorToast({ title: translate(`${this.TRANSLOCO_SCOPE}.toast.error`) }),
    });
  }
}
