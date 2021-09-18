import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { bounceOutAnimation, wobbleAnimation } from 'angular-animations';
import { first } from 'rxjs/operators';
import { HeaderService } from '../../../../../core/services/header.service';
import { ToasterService } from '../../../../../shared/services/toaster.service';
import { setTemplateValidatorsPipe } from '../../../../../shared/utils/forms/rxjs/set-template-validators.rxjs.pipe';
import { ActivationTokenService } from '../../../../services/activation-token.service';

@Component({
  selector: 'app-token-request',
  templateUrl: './token-request.component.html',
  styleUrls: ['./token-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [wobbleAnimation(), bounceOutAnimation()],
})
export class TokenRequestComponent implements OnDestroy {
  public form = new FormGroup({
    email: new FormControl(''),
  });

  public success = false;
  public error = false;

  constructor(
    public readonly activationTokenService: ActivationTokenService,
    private readonly headerService: HeaderService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly toasterService: ToasterService,
  ) {
    this.headerService.setHeader({ title: 'Activation Token Request' });
    this.activationTokenService
      .getRequestActivationTokenTemplate()
      .pipe(first(), setTemplateValidatorsPipe(this.form))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.headerService.resetHeader();
  }

  onSubmit() {
    this.activationTokenService.requestActivationToken(this.form.value.email).subscribe({
      next: () => this.setStatus(true),
      error: () => this.setStatus(false),
    });
  }

  private setStatus(status: boolean) {
    if (status) {
      this.toasterService.showToast({
        title: 'Activation Token Sent',
        message: 'Please check your email and follow the link to activate your account so you can login again',
      });
    } else {
      this.toasterService.showToast({
        title: 'Please check your email or try again later',
      });
    }
    this.success = status;
    this.error = !status;
    this.cdr.markForCheck();
  }

  onSuccess() {
    if (this.success) {
      this.router.navigate(['/auth', 'activate']);
    }
  }
}
