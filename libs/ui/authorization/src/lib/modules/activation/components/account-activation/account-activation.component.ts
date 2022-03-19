import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CardViewHeaderService, matchingControlsValidators, ToasterService } from '@app/ui/shared';
import { bounceOutAnimation, wobbleAnimation } from 'angular-animations';
import { ActivationTokenService } from '../../../../services/activation-token.service';

@Component({
  selector: 'app-account-activation',
  templateUrl: './account-activation.component.html',
  styleUrls: ['./account-activation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [wobbleAnimation(), bounceOutAnimation()],
})
export class AccountActivationComponent implements OnDestroy {
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

  constructor(
    public readonly activationTokenService: ActivationTokenService,
    private readonly headerService: CardViewHeaderService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly toasterService: ToasterService,
  ) {
    this.headerService.setHeader({ title: 'Activate Account' });
    this.route.queryParams.subscribe((params) => this.form.patchValue(params));
  }

  ngOnDestroy(): void {
    this.headerService.resetHeader();
  }

  onSuccess() {
    if (this.success) {
      this.router.navigate(['/auth', 'login']);
    }
  }

  onSubmit() {
    this.activationTokenService.activateAccount(this.form.value).subscribe({
      next: () => this.setStatus(true),
      error: () => this.setStatus(false),
    });
  }

  private setStatus(status: boolean) {
    if (status) {
      this.toasterService.showToast({
        title: 'Account Activated',
        message: 'You can now login.',
      });
    } else {
      this.toasterService.showToast({
        title: 'Invalid data, mind that the token is only valid for a few attempts.',
      });
    }
    this.success = status;
    this.error = !status;
    this.cdr.markForCheck();
  }
}
