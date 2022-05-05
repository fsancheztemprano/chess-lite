import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '@app/ui/shared/app';
import { setTemplateValidatorsPipe } from '@app/ui/shared/common';
import { translate } from '@ngneat/transloco';
import { bounceOutAnimation, wobbleAnimation } from 'angular-animations';
import { first } from 'rxjs/operators';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [wobbleAnimation(), bounceOutAnimation()],
})
export class SignupComponent {
  public signupForm = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    firstname: new FormControl(''),
    lastname: new FormControl(''),
  });

  public signupSuccess = false;
  public signupError = false;
  public readonly TRANSLOCO_SCOPE = 'authentication.signup';

  constructor(
    public readonly authService: AuthService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly toasterService: ToasterService,
  ) {
    this.authService.getSignupTemplate().pipe(first(), setTemplateValidatorsPipe(this.signupForm)).subscribe();
  }

  public onSubmit(): void {
    this.authService.signup(this.signupForm.value)?.subscribe({
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
    }
    this.signupSuccess = status;
    this.signupError = !status;
    this.cdr.markForCheck();
  }

  public onSignupSuccess() {
    if (this.signupSuccess) {
      this.router.navigate(['/auth', 'login']);
    }
  }
}
